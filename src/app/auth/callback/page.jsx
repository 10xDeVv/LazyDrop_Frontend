// app/auth/callback/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const supabase = createClient();
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const run = async () => {
            // Supabase handles the OAuth code exchange automatically in the browser
            // as long as the URL contains the code params.
            const redirectParam = params.get("redirect");
            const redirect = (redirectParam && redirectParam.startsWith('/'))
                ? redirectParam
                : "/send";

            // Ensure session is loaded after callback
            await supabase.auth.getSession();

            router.replace(redirect);
            router.refresh();
        };

        run();
    }, [router, params, supabase]);

    return null;
}
