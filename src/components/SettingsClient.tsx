'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeb3 } from '@/hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import { hexToHsl, hslToHex } from '@/lib/utils';
import { Paintbrush, User, Undo2 } from 'lucide-react';

const defaultColors = {
  background: "222 47% 11%",
  primary: "276 98% 85%",
  accent: "276 56% 77%",
};

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => {
    return (
        <div className="flex items-center justify-between">
            <Label>{label}</Label>
            <div className="relative h-10 w-28 rounded-md border overflow-hidden">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label={`Select ${label}`}
                />
                <div className="w-full h-full flex items-center justify-center font-mono text-sm uppercase" style={{ backgroundColor: value }}>
                    <span className="mix-blend-difference text-white">{value}</span>
                </div>
            </div>
        </div>
    );
};

function ThemeForm() {
    const [colors, setColors] = useState({
        background: hslToHex(defaultColors.background),
        primary: hslToHex(defaultColors.primary),
        accent: hslToHex(defaultColors.accent),
    });
    const { toast } = useToast();

    useEffect(() => {
        const savedTheme = localStorage.getItem('memory-weavers-theme');
        if (savedTheme) {
            const parsedTheme = JSON.parse(savedTheme);
            setColors({
                background: hslToHex(parsedTheme.background || defaultColors.background),
                primary: hslToHex(parsedTheme.primary || defaultColors.primary),
                accent: hslToHex(parsedTheme.accent || defaultColors.accent),
            });
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const theme = {
            background: hexToHsl(colors.background),
            primary: hexToHsl(colors.primary),
            accent: hexToHsl(colors.accent),
        };
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--accent', theme.accent);
        
        localStorage.setItem('memory-weavers-theme', JSON.stringify(theme));
    }, [colors]);

    const handleColorChange = (key: keyof typeof colors, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const resetTheme = () => {
        setColors({
            background: hslToHex(defaultColors.background),
            primary: hslToHex(defaultColors.primary),
            accent: hslToHex(defaultColors.accent),
        });
        toast({
            title: 'Theme Reset',
            description: 'The color theme has been reset to its default values.',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the look and feel of the application. Changes are saved to your browser.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ColorPicker label="Background" value={colors.background} onChange={(val) => handleColorChange('background', val)} />
                <ColorPicker label="Primary" value={colors.primary} onChange={(val) => handleColorChange('primary', val)} />
                <ColorPicker label="Accent" value={colors.accent} onChange={(val) => handleColorChange('accent', val)} />
                <Button variant="outline" onClick={resetTheme}>
                    <Undo2 className="mr-2 h-4 w-4" />
                    Reset to Defaults
                </Button>
            </CardContent>
        </Card>
    );
}

function ProfileForm() {
    const { username: currentUsername, setUsername, isConnected } = useWeb3();
    const [name, setName] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (isConnected) {
            setName(currentUsername || '');
        }
    }, [currentUsername, isConnected]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || name.length < 3 || name.length > 20) {
            toast({
                title: 'Invalid Username',
                description: 'Username must be between 3 and 20 characters.',
                variant: 'destructive',
            });
            return;
        }
        setUsername(name);
        toast({
            title: 'Success!',
            description: 'Your username has been updated.',
        });
    };

    if (!isConnected) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Connect your wallet to set a username.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Your username will be linked to your wallet address and stored in your browser.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is how other users will see you. This is stored only in your browser.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your public username"
                            minLength={3}
                            maxLength={20}
                        />
                    </div>
                    <Button type="submit">Save Changes</Button>
                </CardContent>
            </form>
        </Card>
    );
}


export function SettingsClient() {
    return (
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="profile"><User className="mr-2" /> Profile</TabsTrigger>
                <TabsTrigger value="theme"><Paintbrush className="mr-2" /> Theme</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
                <div className="max-w-md mx-auto">
                  <ProfileForm />
                </div>
            </TabsContent>
            <TabsContent value="theme" className="mt-6">
                <div className="max-w-md mx-auto">
                  <ThemeForm />
                </div>
            </TabsContent>
        </Tabs>
    );
}
