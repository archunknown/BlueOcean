// src/app/contact/page.tsx
import ContactSection from '@/components/sections/Contact';
import { getGlobalSettings } from '../admin/actions';

export default async function ContactPage() {
  const settings = await getGlobalSettings();

  return (
    <main>
      <ContactSection email={settings?.contact_email} phoneNumber={settings?.whatsapp_primary} />
    </main>
  );
}