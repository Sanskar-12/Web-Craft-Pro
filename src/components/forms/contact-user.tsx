"use client"

import { ContactUserFormSchema } from "@/lib/types"
import { useModal } from "@/providers/modal-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "../ui/use-toast"
import { saveActivityLogsNotification, upsertContact } from "@/lib/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Loading from "../loading/loading"

interface ContactUserFormProps {
    subaccountId:string
}

const ContactUserForm = ({subaccountId}:ContactUserFormProps) => {

    const {setClose,data}=useModal()
    const router=useRouter()
    const form = useForm<z.infer<typeof ContactUserFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(ContactUserFormSchema),
        defaultValues: {
          name: '',
          email: '',
        },
      })

      useEffect(()=>{
        if(data.contact)
        {
            form.reset(data.contact)
        }
      },[data,form])

      const isLoading=form.formState.isLoading

      const handleSubmit=async(values:z.infer<typeof ContactUserFormSchema>)=>{
        try {
            const response=await upsertContact({
                email:values.email,
                subAccountId:subaccountId,
                name:values.name
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated a contact | ${response?.name}`,
                subaccountId: subaccountId,
              })
              toast({
                title: 'Success',
                description: 'Saved funnel details',
              })
              setClose()
              router.refresh()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could not save funnel details',
              })
        }
      }

  return (
    <Card className=" w-full">
    <CardHeader>
      <CardTitle>Contact Info</CardTitle>
      <CardDescription>
        You can assign tickets to contacts and set a value for each contact in
        the ticket.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            disabled={isLoading}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="mt-4"
            disabled={isLoading}
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <Loading />
            ) : (
              'Save Contact Details!'
            )}
          </Button>
        </form>
      </Form>
    </CardContent>
  </Card>
  )
}

export default ContactUserForm