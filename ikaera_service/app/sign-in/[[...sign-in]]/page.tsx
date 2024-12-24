import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main>
      <div className="flex justify-center items-center flex-col row-span-2">
        <SignIn
          signUpUrl="/sign-up" // Redirect to sign-up page on clicking the sign-up link
          fallbackRedirectUrl="/admin"
          signUpFallbackRedirectUrl="/admin"
        />
      </div>
    </main>
  );
}
