"use client";

import {
  AuthUserWithAgencySigebarOptionsSubAccounts,
  UserWithPermissionAndSubAccounts,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { SubAccount, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from "@/lib/queries";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../file-upload/file-upload";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface UserDetailsProps {
  id: string | null;
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
}

const UserDetails = ({ id, type, userData, subAccounts }: UserDetailsProps) => {
  const [subAccountPermissions, setSubAccountsPermissions] =
    useState<UserWithPermissionAndSubAccounts | null>(null);

  const { data, setClose } = useModal();
  const [roleState, setRoleState] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails();
        if (response) setAuthUserData(response);
      };
      fetchDetails();
    }
  }, [data]);

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum([
      "AGENCY_OWNER",
      "AGENCY_ADMIN",
      "SUBACCOUNT_USER",
      "SUBACCOUNT_GUEST",
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermission = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data.user.id);
      setSubAccountsPermissions(permission);
    };
    getPermission();
  }, [data, form]);

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [userData, data, form]);

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (userData || data?.user) {
      const updatedUser = await updateUser(values);

      authUserData?.Agency?.SubAccount.filter((subaccount) =>
        authUserData?.Permissions?.find(
          (p) => p.subAccountId === subaccount.id && p.access
        )
      ).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subaccountId: subaccount.id,
        });
      });

      if (updatedUser) {
        toast({
          title: "Success",
          description: "Update User Information",
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Oppse!",
          description: "Could not update user information",
        });
      }
    } else {
      console.log("Error could not submit.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleState(
                          "You need to have subaccounts to assign Subaccount access to team members."
                        );
                      } else {
                        setRoleState("");
                      }

                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMING">
                        Agency Admin
                      </SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            ></FormField>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
