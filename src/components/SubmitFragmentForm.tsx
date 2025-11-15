'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { submitFragmentAction } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';

const initialState: { message: string, success: boolean } = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Weaving...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Weave Memory
        </>
      )}
    </Button>
  );
}

export function SubmitFragmentForm() {
  const [state, formAction] = useFormState(submitFragmentAction, initialState);
  const { toast } = useToast();
  const { isConnected, address, connectWallet } = useWeb3();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Oops!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  if (!isConnected) {
    return (
        <Card className="bg-card/50 border-dashed border-primary/50">
            <CardHeader className="items-center text-center">
                <CardTitle>Connect to Participate</CardTitle>
                <CardDescription>
                    Connect your wallet to start weaving your memories into the collective.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={connectWallet} className="w-full">Connect Wallet</Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="author" value={address || ''} />
        <div className="grid w-full gap-2">
            <Label htmlFor="fragment">Your Memory Fragment</Label>
            <Textarea
                id="fragment"
                name="fragment"
                placeholder="A dream, a fleeting thought, a cherished moment..."
                maxLength={200}
                required
                className="min-h-[120px] text-base bg-input"
            />
            <p className="text-sm text-muted-foreground">Max 200 characters.</p>
        </div>
        <SubmitButton />
    </form>
  );
}
