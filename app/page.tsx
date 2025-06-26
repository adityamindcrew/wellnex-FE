import { redirect } from "next/navigation"

export default function Home() {
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  redirect("/landing")
  return null;
}
