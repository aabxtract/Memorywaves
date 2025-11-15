import { SubmitFragmentForm } from "@/components/SubmitFragmentForm";
import { getFragments } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Home() {
    const recentFragments = (await getFragments()).slice(-5).reverse();

    return (
        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Weave a New Memory</h1>
                <p className="text-muted-foreground mb-6">Contribute your thoughts, dreams, or moments to the collective memory. Your fragment will be analyzed by AI and linked to similar memories.</p>
                <SubmitFragmentForm />
            </div>
            <div className="lg:col-span-2">
                 <h2 className="text-2xl font-bold tracking-tight mb-6">Recent Fragments</h2>
                 <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                    {recentFragments.map(fragment => (
                        <Card key={fragment.id} className="bg-card/50">
                            <CardContent className="p-4">
                                <p className="mb-2 italic">"{fragment.text}"</p>
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>{formatDistanceToNow(new Date(fragment.timestamp), { addSuffix: true })}</span>
                                    {fragment.clusterId && <Badge variant="secondary">Cluster {fragment.clusterId}</Badge>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
