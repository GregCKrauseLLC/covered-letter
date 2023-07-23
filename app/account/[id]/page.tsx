// Third party
import { prisma } from "@/lib/prisma";

// Local
// import Account from "../../../components/account/Account"; // TODO: implement account page
import ResponsiveDrawer from "../../../components/responsive-drawer/ResponsiveDrawer";

interface Props {
  params: { id: string };
}

export default async function Account({ params }: Props) {
  const account = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!account) {
    return (
      <main className={"main"}>
        <ResponsiveDrawer currentTab={"Account"}>Account not found!</ResponsiveDrawer>
      </main>
    );
  }

  return (
    <main className={"main"}>
      <ResponsiveDrawer currentTab={"Account"}>
        {/*<Account account={account} />*/}
      </ResponsiveDrawer>
    </main>
  );
}
