import { useState, useRef, useEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import {
    ArrowRight,
    Mail,
    MailWarning,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Sparkles,
    GraduationCap,
    Briefcase,
    Search,
    Send,
    Target,
    TrendingUp,
    Shield,
    Zap
} from 'lucide-react'

// Animated 3D Background Particles
function StarField(props) {
    const ref = useRef()
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }))

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10
        ref.current.rotation.y -= delta / 15
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#6366f1"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

// Floating Sphere
function FloatingSphere() {
    const meshRef = useRef()

    useFrame((state) => {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
        meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
    })

    return (
        <Sphere ref={meshRef} args={[1, 100, 200]} scale={0.8}>
            <MeshDistortMaterial
                color="#6366f1"
                attach="material"
                distort={0.5}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    )
}

// Animated Counter
function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let start = 0
        const increment = target / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [isVisible, target, duration])

    return <span ref={ref}>{prefix}{count}{suffix}</span>
}

// Problem Card Component
function ProblemCard({ icon: Icon, title, description, delay }) {
    return (
        <div
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-red-500/50 transition-all duration-500 hover:transform hover:scale-105"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    )
}

// Solution Card Component
function SolutionCard({ icon: Icon, title, description, delay }) {
    return (
        <div
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    )
}

// Feature Card
function FeatureCard({ icon: Icon, title, description, gradient }) {
    return (
        <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/50 transition-all duration-500 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    )
}

// How It Works Step
function HowItWorksStep({ number, title, description, forWho }) {
    return (
        <div className="relative">
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary-500/30">
                    {number}
                </div>
                <div>
                    <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">{forWho}</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">{title}</h3>
                    <p className="text-gray-400 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">Ween</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-5 py-2.5 text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* 3D Background */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 1] }}>
                        <Suspense fallback={null}>
                            <StarField />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 mb-8">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">The LinkedIn for Research Students</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Stop Cold Emailing.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
                            Start Connecting.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Ween connects ambitious students with research professors through a streamlined platform.
                        No more sending 100 emails hoping for one reply.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105"
                        >
                            Start for Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-lg rounded-xl font-semibold text-lg border border-white/10 hover:border-white/30 transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                <AnimatedCounter target={95} suffix="%" />
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Less Email Spam</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                <AnimatedCounter target={10} suffix="x" />
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Faster Matching</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                <AnimatedCounter target={100} suffix="%" />
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Transparency</div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll" />
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-6">
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400 font-medium">The Problem</span>
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Cold Emailing is <span className="text-red-400">Broken</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Students send 50-100 cold emails just to land one research internship.
                            Professors are drowning in unqualified applications they can't effectively review.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProblemCard
                            icon={MailWarning}
                            title="Inbox Overload"
                            description="Professors receive hundreds of cold emails. Most go unread. Your perfect application? Lost in the noise."
                            delay={0}
                        />
                        <ProblemCard
                            icon={Search}
                            title="Blind Applications"
                            description="Students apply without knowing if positions exist, research fit, or timing—wasting everyone's time."
                            delay={100}
                        />
                        <ProblemCard
                            icon={Clock}
                            title="First-Come First-Serve"
                            description="If Average applies first, Good second, and Excellent third—the professor might pick Average before seeing Excellent."
                            delay={200}
                        />
                    </div>

                    {/* Visual representation */}
                    <div className="mt-16 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-4">The Cold Email Reality</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-4 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="w-[2%] h-full bg-red-500 rounded-full" />
                                        </div>
                                        <span className="text-gray-400">~2% response rate</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-4 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="w-[15%] h-full bg-orange-500 rounded-full" />
                                        </div>
                                        <span className="text-gray-400">~15% even opened</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-4 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full" />
                                        </div>
                                        <span className="text-gray-400">100% frustration</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-20" />
                                    <div className="relative grid grid-cols-5 gap-2">
                                        {[...Array(50)].map((_, i) => (
                                            <Mail
                                                key={i}
                                                className={`w-6 h-6 ${i < 49 ? 'text-gray-600' : 'text-green-500'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-center text-gray-400 mt-4 text-sm">50 emails → 1 maybe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-6">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400 font-medium">The Solution</span>
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ween Makes it <span className="text-green-400">Simple</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            A structured platform where professors post opportunities and students apply to real positions.
                            No guessing. No spam. Just connections.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SolutionCard
                            icon={Target}
                            title="Real Opportunities"
                            description="Only apply to actual openings. Know positions available, required skills, and deadlines upfront."
                            delay={0}
                        />
                        <SolutionCard
                            icon={Users}
                            title="Compare All Applicants"
                            description="Professors see all candidates before deciding. The best applicant wins, not the earliest."
                            delay={100}
                        />
                        <SolutionCard
                            icon={TrendingUp}
                            title="Track Applications"
                            description="Know your application status in real-time. No more wondering if your email was even received."
                            delay={200}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-xl text-gray-400">Simple for everyone involved</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* For Professors */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">For Professors</h3>
                            </div>
                            <div className="space-y-8">
                                <HowItWorksStep
                                    number="1"
                                    title="Post Your Opening"
                                    description="Create an internship listing with research area, required skills, duration, and positions available."
                                    forWho="Create"
                                />
                                <HowItWorksStep
                                    number="2"
                                    title="Receive Applications"
                                    description="Students apply through the platform. Review all candidates in one organized dashboard."
                                    forWho="Review"
                                />
                                <HowItWorksStep
                                    number="3"
                                    title="Select the Best"
                                    description="Compare all applicants side-by-side. Accept the perfect candidate, not just the first one."
                                    forWho="Decide"
                                />
                            </div>
                        </div>

                        {/* For Students */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">For Students</h3>
                            </div>
                            <div className="space-y-8">
                                <HowItWorksStep
                                    number="1"
                                    title="Browse Opportunities"
                                    description="See all available research internships. Filter by field, skills, duration, and more."
                                    forWho="Discover"
                                />
                                <HowItWorksStep
                                    number="2"
                                    title="Apply with Confidence"
                                    description="Apply to real positions that match your skills. Your application will be seen."
                                    forWho="Apply"
                                />
                                <HowItWorksStep
                                    number="3"
                                    title="Track & Connect"
                                    description="Monitor your application status. Get notified when you're accepted."
                                    forWho="Succeed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Research</h2>
                        <p className="text-xl text-gray-400">Everything you need to connect and succeed</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Search}
                            title="Smart Filters"
                            description="Filter internships by research area, required skills, duration, and deadline."
                            gradient="from-blue-500 to-cyan-500"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Verified Profiles"
                            description="All professors and students have verified academic profiles."
                            gradient="from-green-500 to-emerald-500"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Notifications"
                            description="Get notified immediately when your application status changes."
                            gradient="from-yellow-500 to-orange-500"
                        />
                        <FeatureCard
                            icon={Target}
                            title="Skill Matching"
                            description="See how well your skills match each opportunity's requirements."
                            gradient="from-purple-500 to-pink-500"
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Deadline Tracking"
                            description="Never miss an opportunity with clear deadlines and reminders."
                            gradient="from-red-500 to-rose-500"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Application Dashboard"
                            description="Track all your applications in one organized dashboard."
                            gradient="from-indigo-500 to-violet-500"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent" />

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Transform Your Research Career?
                        </h2>
                        <p className="text-xl text-gray-400 mb-10">
                            Join hundreds of students and professors already using Ween to make meaningful research connections.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-lg rounded-xl font-semibold text-lg border border-white/10 hover:border-white/30 transition-all duration-300"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold">Ween</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2024 Ween. Connecting research talent with opportunity.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                @keyframes scroll {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(4px); opacity: 0.5; }
                }
                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
