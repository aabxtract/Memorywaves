import { SettingsClient } from '@/components/SettingsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings | Memory Weavers',
    description: 'Customize your profile and application theme.',
};

export default function SettingsPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Customize your profile and the appearance of the application.</p>
            </div>
            <SettingsClient />
        </>
    );
}
