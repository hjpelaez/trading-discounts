"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={copy}
            className="p-1.5 hover:bg-background rounded-md transition-colors"
            title="Copy Code"
        >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
            <span className="sr-only">Copy</span>
        </button>
    );
}
