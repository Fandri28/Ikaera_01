import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main>
      <div className="flex justify-center items-center flex-col row-span-2">
        <SignUp
          appearance={{
            elements: {
              card: 'border-none p-5 rounded-lg', // Customize the card (container)
              headerTitle: 'text-2xl text-blue-600', // Customize the header title
              formButtonPrimary: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', // Customize the primary button
              footerActionLink: 'text-blue-600 hover:underline', // Customize the footer links
              internal: 'text-white', // Keep footer visible
            },
            variables: {
              colorPrimary: '#1E40AF', // Change the primary color
              colorText: '#111827', // Change text color
              borderRadius: '8px', // Adjust border radius
            },
          }}
          signInUrl="/sign-in" // Redirect to sign-in page on clicking the sign-up link
         
        />
      </div>
    </main>
  );
}
