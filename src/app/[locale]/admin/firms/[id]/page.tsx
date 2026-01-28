import { FirmForm } from "@/components/firm-form";
import { getFirmById } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditFirmPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const firm = await getFirmById(id);

    if (!firm) {
        notFound();
    }

    return (
        <FirmForm firm={firm} />
    );
}
