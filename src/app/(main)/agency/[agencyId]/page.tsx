import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ClipboardIcon, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AgencyPageProps {
  params: { agencyId: string };
}

const AgencyPage = async ({ params: { agencyId } }: AgencyPageProps) => {
  let currency = "USD";
  let sessions;
  let totalClosedSessions;
  let totalPendingSessions;
  let netIncome = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
  });

  if (!agencyDetails) return;

  const subaccounts = db.subAccount.findMany({
    where: {
      agencyId,
    },
  });

  if (agencyDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
    });

    currency = response.default_currency?.toUpperCase() || "USD";

    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: {
          gte: startDate,
          lte: endDate,
        },
        limit: 100,
      },
      {
        stripeAccount: agencyDetails.connectAccountId,
      }
    );

    sessions = checkoutSessions.data;

    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    netIncome = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    closingRate = +(
      (totalClosedSessions.length / checkoutSessions.data.length) *
      100
    ).toFixed(2);
  }

  return (
    <div className="relative h-full">
      {!agencyDetails.connectAccountId && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Stripe</CardTitle>
            <CardDescription>
              You need to connect your stripe account to see metrics
            </CardDescription>
            <Link
              href={`/agency/${agencyDetails.id}/launchpad`}
              className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
            >
              <ClipboardIcon />
              Launch Pad
            </Link>
          </CardHeader>
        </Card>
      )}
      <h1 className="text-4xl">Dashboard</h1>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-4xl">
                {netIncome ? `${currency} ${netIncome.toFixed(2)}` : `$0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated as reflected in your stripe dashboard.
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyPage;
