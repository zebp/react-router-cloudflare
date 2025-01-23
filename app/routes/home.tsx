import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Form, useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const { testing } = context.cloudflare.env;
  const value = await testing.get("key");
  return { value: value ?? "<empty>" };
}

export async function action({ context, request }: Route.ActionArgs) {
  const { testing } = context.cloudflare.env;
  const form = await request.formData();
  const value = await testing.put(
    "key",
    form.get("value")?.toString() ?? "<invalid>"
  );

  return { value };
}

export default function Home() {
  const { value } = useLoaderData<typeof loader>();

  return (
    <>
      Current value in KV: {value}
      <Form method="POST" navigate={false}>
        <label>
          Value
          <input name="value" />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
