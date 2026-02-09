
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationEmailProps {
    clientName: string;
    tourTitle: string;
    date: string;
    time: string;
    pax: number;
    totalPrice: string;
    voucherLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : '';

export const BookingConfirmationEmail = ({
    clientName,
    tourTitle,
    date,
    time,
    pax,
    totalPrice,
    voucherLink,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>¡Tu reserva en Paracas está confirmada! 🌊</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        {/* Header */}
                        <Section className="mt-[32px]">
                            {/* Placeholder for Logo if available, else text */}
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                BLUE OCEAN
                            </Heading>
                        </Section>

                        {/* Greeting */}
                        <Heading className="text-black text-[20px] font-normal text-center p-0 my-[30px] mx-0">
                            ¡Hola {clientName}!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Tu reserva ha sido confirmada exitosamente. Estamos emocionados de tenerte con nosotros para esta aventura.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Aquí tienes un resumen de tu compra:
                        </Text>

                        {/* Booking Details Table */}
                        <Section className="border border-solid border-[#eaeaea] rounded p-[20px] my-[20px]">
                            <Row>
                                <Column>
                                    <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold m-0 mb-[4px]">
                                        Tour
                                    </Text>
                                    <Text className="text-black text-[14px] font-medium m-0 mb-[16px]">
                                        {tourTitle}
                                    </Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column>
                                    <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold m-0 mb-[4px]">
                                        Fecha
                                    </Text>
                                    <Text className="text-black text-[14px] m-0 mb-[16px]">
                                        {date}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold m-0 mb-[4px]">
                                        Hora
                                    </Text>
                                    <Text className="text-black text-[14px] m-0 mb-[16px]">
                                        {time}
                                    </Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column>
                                    <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold m-0 mb-[4px]">
                                        Pasajeros
                                    </Text>
                                    <Text className="text-black text-[14px] m-0 mb-[16px]">
                                        {pax} personas
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold m-0 mb-[4px]">
                                        Total Pagado
                                    </Text>
                                    <Text className="text-black text-[14px] font-bold m-0 mb-[16px]">
                                        {totalPrice}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* CTA */}
                        <Section className="text-center my-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={voucherLink}
                            >
                                Descargar Mi Voucher
                            </Link>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Por favor, preséntate 15 minutos antes de la hora programada en nuestra oficina.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        {/* Footer */}
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Blue Ocean Paracas Tours<br />
                            Paracas, Ica, Perú<br />
                            <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} className="text-blue-600 underline">
                                Contactar por WhatsApp
                            </Link>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

// Required for HR which I forgot to import
import { Hr } from '@react-email/components';

export default BookingConfirmationEmail;
