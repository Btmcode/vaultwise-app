
'use client';

import { useParams } from 'next/navigation';
import { getDictionary } from '@/app/dictionaries';
import { VaultWiseLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart, LineChart, PieChart, TrendingUp, ShieldCheck, Cpu, Banknote, Target, Users, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function InvestorPresentationPage() {
    const params = useParams();
    const lang = params.lang as 'tr' | 'en';
    const dict = getDictionary(lang);

    const content = {
        tr: {
            backToHome: "Ana Sayfaya Dön",
            title: "VaultWise Yatırımcı Sunumu",
            subtitle: "Finansal Güvenliğin Geleceğini İnşa Ediyoruz",
            sections: {
                problem: {
                    title: "Piyasadaki Problem: Güven ve Karmaşıklık",
                    points: [
                        "Dijital varlıkların soyut doğası ve yüksek volatilitesi, geleneksel yatırımcılar için bir engel teşkil ediyor.",
                        "Değerli metal yatırımları, fiziksel saklama ve anında likidite zorlukları içeriyor.",
                        "Modern yatırımcılar, her iki dünyanın avantajlarını birleştiren, ancak kullanımı kolay ve güvenilir bir platform arıyor."
                    ]
                },
                solution: {
                    title: "Çözümümüz: VaultWise - Hibrit Varlık Platformu",
                    description: "VaultWise, değerli metallerin somut güvencesini dijital varlıkların esnekliği ile birleştiren, türünün ilk örneği bir finansal teknoloji platformudur. Kullanıcılarımıza hem fiziksel olarak sigortalı hem de dijital olarak 7/24 erişilebilir bir portföy yönetimi sunuyoruz.",
                    iconPoints: [
                        { icon: ShieldCheck, text: "Tüm varlıklar için sigortalı, fiziksel kasa güvencesi." },
                        { icon: Cpu, text: "Kişiselleştirilmiş stratejiler sunan YD destekli portföy analizi." },
                        { icon: TrendingUp, text: "Anlık alım-satım imkanı sunan likit bir pazar." }
                    ]
                },
                market: {
                    title: "Pazar Fırsatı ve Hedef Kitle",
                    description: "Finansal belirsizliklerin arttığı bir dünyada, güvenli liman arayışı hem bireysel hem de kurumsal yatırımcılar için en üst düzeyde. Hedef kitlemiz:",
                    points: [
                        "Teknolojiye meraklı, dijital yerli Y ve Z kuşağı.",
                        "Portföyünü çeşitlendirmek isteyen geleneksel yatırımcılar.",
                        "Varlıklarının güvenliğine öncelik veren orta ve uzun vadeli birikim sahipleri."
                    ]
                },
                businessModel: {
                    title: "İş Modeli ve Gelir Akışı",
                    cards: [
                        { icon: Banknote, title: "İşlem Ücretleri", description: "Platform üzerinde gerçekleştirilen her alım-satım işleminden %0.5 - %1.5 arası rekabetçi bir komisyon alınacaktır." },
                        { icon: Cpu, title: "Premium YD Analizi (Abonelik)", description: "Derinlemesine pazar analizi, özel yatırım sinyalleri ve otomatik birikim stratejileri için aylık abonelik modeli (Örn: 10$/ay)." },
                        { icon: ShieldCheck, title: "Saklama (Custody) Ücretleri", description: "Belirli bir portföy büyüklüğünü aşan kurumsal ve büyük bireysel yatırımcılardan yıllık %0.25 oranında sigortalı saklama ücreti alınacaktır." }
                    ]
                },
                financials: {
                    title: "Finansal Projeksiyonlar ve Yatırım İhtiyacı",
                    investmentNeed: "Başlangıç (Seed) Turu Yatırım İhtiyacı: 500.000 USD",
                    useOfFunds: "Fon Kullanımı:",
                    funds: [
                        { label: "Teknoloji ve Ürün Geliştirme (%40)", value: 200000 },
                        { label: "Pazarlama ve Kullanıcı Kazanımı (%30)", value: 150000 },
                        { label: "Operasyonel Giderler ve Ekip (%20)", value: 100000 },
                        { label: "Hukuki ve Lisanslama Maliyetleri (%10)", value: 50000 }
                    ],
                    projections: {
                        title: "3 Yıllık Gelir Beklentisi",
                        year1: "Yıl 1: 250.000 USD (10.000 aktif kullanıcı hedefi)",
                        year2: "Yıl 2: 1.2 Milyon USD (50.000 aktif kullanıcı hedefi)",
                        year3: "Yıl 3: 5 Milyon USD (200.000+ aktif kullanıcı hedefi)"
                    }
                },
                team: {
                    title: "Ekip",
                    description: "VaultWise, finans, teknoloji ve güvenlik alanlarında deneyimli, tutkulu bir ekip tarafından yönetilmektedir."
                },
                callToAction: {
                    title: "Geleceği Birlikte İnşa Edelim",
                    description: "Finansal teknolojide bir devrim yaratma ve yatırımcılara gerçek güvence sunma vizyonumuza ortak olun. VaultWise'ın bir sonraki büyüme adımına liderlik etmek için bize katılın.",
                    button: "İletişime Geçin"
                }
            }
        },
        en: {
            backToHome: "Back to Home",
            title: "VaultWise Investor Presentation",
            subtitle: "Building the Future of Financial Security",
            sections: {
                problem: {
                    title: "The Problem in the Market: Trust and Complexity",
                    points: [
                        "The abstract nature and high volatility of digital assets pose a barrier for traditional investors.",
                        "Precious metal investments involve challenges of physical storage and instant liquidity.",
                        "Modern investors are looking for a platform that combines the advantages of both worlds but is easy to use and trustworthy."
                    ]
                },
                solution: {
                    title: "Our Solution: VaultWise - The Hybrid Asset Platform",
                    description: "VaultWise is a first-of-its-kind financial technology platform that combines the tangible security of precious metals with the flexibility of digital assets. We offer our users portfolio management that is both physically insured and digitally accessible 24/7.",
                    iconPoints: [
                        { icon: ShieldCheck, text: "Insured, physical vault security for all assets." },
                        { icon: Cpu, text: "AI-powered portfolio analysis offering personalized strategies." },
                        { icon: TrendingUp, text: "A liquid market providing instant trading capabilities." }
                    ]
                },
                market: {
                    title: "Market Opportunity and Target Audience",
                    description: "In a world of increasing financial uncertainty, the search for a safe haven is paramount for both individual and institutional investors. Our target audience includes:",
                    points: [
                        "Tech-savvy, digital-native Generations Y and Z.",
                        "Traditional investors looking to diversify their portfolios.",
                        "Medium to long-term savers who prioritize the security of their assets."
                    ]
                },
                businessModel: {
                    title: "Business Model and Revenue Streams",
                    cards: [
                        { icon: Banknote, title: "Transaction Fees", description: "A competitive commission of 0.5% - 1.5% will be charged for every buy/sell transaction on the platform." },
                        { icon: Cpu, title: "Premium AI Analysis (Subscription)", description: "A monthly subscription model (e.g., $10/month) for in-depth market analysis, special investment signals, and automated savings strategies." },
                        { icon: ShieldCheck, title: "Custody Fees", description: "An annual insured custody fee of 0.25% will be charged to institutional and large individual investors exceeding a certain portfolio size." }
                    ]
                },
                financials: {
                    title: "Financial Projections and Funding Requirement",
                    investmentNeed: "Seed Round Funding Requirement: $500,000 USD",
                    useOfFunds: "Use of Funds:",
                    funds: [
                        { label: "Technology & Product Development (40%)", value: 200000 },
                        { label: "Marketing & User Acquisition (30%)", value: 150000 },
                        { label: "Operational Expenses & Team (20%)", value: 100000 },
                        { label: "Legal & Licensing Costs (10%)", value: 50000 }
                    ],
                    projections: {
                        title: "3-Year Revenue Projection",
                        year1: "Year 1: $250,000 USD (Targeting 10,000 active users)",
                        year2: "Year 2: $1.2 Million USD (Targeting 50,000 active users)",
                        year3: "Year 3: $5 Million USD (Targeting 200,000+ active users)"
                    }
                },
                team: {
                    title: "The Team",
                    description: "VaultWise is led by a passionate team with deep experience in finance, technology, and security."
                },
                callToAction: {
                    title: "Let's Build the Future Together",
                    description: "Join us in our vision to revolutionize financial technology and provide real security to investors. Become a part of leading VaultWise's next phase of growth.",
                    button: "Contact Us"
                }
            }
        }
    };

    const currentContent = content[lang] || content.tr;
    const s = currentContent.sections;
    const totalFunds = s.financials.funds.reduce((acc, fund) => acc + fund.value, 0);

    return (
        <div className="bg-background text-foreground min-h-screen">
            <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b">
                <Link href={`/${lang}`} className="flex items-center justify-center" prefetch={false}>
                    <VaultWiseLogo className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-xl font-bold hidden sm:inline-block">VaultWise</span>
                </Link>
                <nav className="ml-auto">
                    <Button asChild variant="outline">
                        <Link href={`/${lang}`}>{currentContent.backToHome}</Link>
                    </Button>
                </nav>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="text-center py-16">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                        {currentContent.title}
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground">{currentContent.subtitle}</p>
                </section>

                <div className="space-y-24">
                    {/* Problem */}
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-3xl">
                                <Target className="h-8 w-8 text-destructive" />
                                {s.problem.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 text-lg text-muted-foreground">
                                {s.problem.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-destructive mt-1">●</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Solution */}
                    <Card className="bg-secondary/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-3xl">
                                <TrendingUp className="h-8 w-8 text-accent" />
                                {s.solution.title}
                            </CardTitle>
                             <CardDescription className="text-lg pt-2">{s.solution.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6 pt-4">
                           {s.solution.iconPoints.map((point, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                                    <point.icon className="h-8 w-8 text-accent shrink-0" />
                                    <p className="text-md font-medium">{point.text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Business Model */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-3xl">
                                <Scale className="h-8 w-8 text-primary" />
                                {s.businessModel.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-8">
                            {s.businessModel.cards.map((card, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 bg-secondary/20 rounded-xl">
                                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                                        <card.icon className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{card.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{card.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                     {/* Financials */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-3xl">
                                <BarChart className="h-8 w-8 text-primary" />
                                {s.financials.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-accent">{s.financials.investmentNeed}</h3>
                                <p className="mt-4 text-xl font-semibold">{s.financials.useOfFunds}</p>
                                <div className="mt-4 space-y-3">
                                    {s.financials.funds.map((fund, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-muted-foreground">{fund.label}</span>
                                                <span className="font-medium">${fund.value.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2.5">
                                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(fund.value / totalFunds) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-xl font-semibold mb-4">{s.financials.projections.title}</h3>
                                <div className="space-y-4">
                                    <Card className="bg-background">
                                        <CardContent className="p-4">
                                            <p className="font-bold text-primary">{s.financials.projections.year1}</p>
                                        </CardContent>
                                    </Card>
                                     <Card className="bg-background">
                                        <CardContent className="p-4">
                                            <p className="font-bold text-primary">{s.financials.projections.year2}</p>
                                        </CardContent>
                                    </Card>
                                     <Card className="bg-background">
                                        <CardContent className="p-4">
                                            <p className="font-bold text-primary">{s.financials.projections.year3}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Call to Action */}
                    <section className="text-center py-16 bg-gradient-to-t from-primary/10 to-transparent rounded-xl">
                        <h2 className="text-4xl font-bold">{s.callToAction.title}</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{s.callToAction.description}</p>
                        <Button size="lg" className="mt-8">
                            {s.callToAction.button}
                        </Button>
                    </section>
                </div>
            </main>
        </div>
    );
}
