import { Button } from "@brasamar/ui";

import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="w-full normal-case tracking-normal"
      >
        Sair
      </Button>
    </form>
  );
}
