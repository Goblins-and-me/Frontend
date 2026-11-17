import { auth, signOut } from "@/auth";

export default async function Profile() {
  const session = await auth();
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div>
      profile_page
      <p>Email: { session?.user?.email }</p>
      <form action={logout}>
        <button type="submit">Выйти</button>
      </form>
    </div>
  );
}
