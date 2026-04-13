import { useState } from "react";
import { useNavigate } from "react-router";
import { MapView } from "../components/MapView";
import { Village, villages } from "../data/villages";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import ministryLogo from "../../../Ministry_of_Jal_Shakti.png";
import wiiLogo from "../../../WII-LogoMaroon (1).png";
import nmcgLogo from "../../../nmcgGif.gif";
import arthGangaLogo from "../../../Arth Ganga eng logo.png";
import {
  Map,
  List,
  Globe,
  BarChart3,
  Users,
  Home,
  Leaf,
  Droplets,
  ArrowRight,
  MapPin,
  Target,
  TreePine,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1576516816755-705b4b24df2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHYW5nZXMlMjByaXZlciUyMEluZGlhJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3MjQ0NjM2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const photoGallery = [
  {
    src: "https://images.unsplash.com/photo-1701619879211-e03adf1993a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWYXJhbmFzaSUyMGdoYXQlMjByaXZlciUyMEdhbmdlc3xlbnwxfHx8fDE3NzI0NDYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption: "Varanasi Ghats - Sacred River Steps",
  },
  {
    src: "https://images.unsplash.com/photo-1720819029162-8500607ae232?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSaXNoaWtlc2glMjByaXZlciUyMGJyaWRnZSUyMEluZGlhfGVufDF8fHx8MTc3MjQ0NjM2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption: "Rishikesh - Gateway to the Himalayas",
  },
  {
    src: "https://images.unsplash.com/photo-1722067487813-3650fb50f028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVdHRhcmFraGFuZCUyMG1vdW50YWluJTIwcml2ZXIlMjBIaW1hbGF5YXxlbnwxfHx8fDE3NzI0NDYzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption: "Uttarakhand - Himalayan River Origins",
  },
  {
    src: "https://images.unsplash.com/photo-1552559590-952a24ab39ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHJpdmVyJTIwc3VucmlzZSUyMGJvYXR8ZW58MXx8fHwxNzcyNDQ2MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    caption: "Sunrise on the Ganga - Daily Life",
  },
];

const focusAreas = [
  { icon: Leaf, label: "Community Awareness", color: "bg-green-100 text-green-600" },
  { icon: Droplets, label: "Hygiene & Sanitation", color: "bg-blue-100 text-blue-600" },
  { icon: TreePine, label: "Biodiversity", color: "bg-emerald-100 text-emerald-600" },
  { icon: Target, label: "Renewable Energy", color: "bg-amber-100 text-amber-600" },
];

const totalPop = villages.reduce((s, v) => s + v.population, 0);
const totalHH = villages.reduce((s, v) => s + v.households, 0);
const statesSet = new Set(villages.map((v) => v.state));
const avgScore = (villages.reduce((s, v) => s + v.overallScore, 0) / villages.length).toFixed(1);

const partnerLogos = [
  { src: ministryLogo, alt: "Ministry of Jal Shakti logo" },
  { src: wiiLogo, alt: "WII logo" },
  { src: nmcgLogo, alt: "NMCG logo" },
  { src: arthGangaLogo, alt: "Arth Ganga logo" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);

  const handleVillageClick = (village: Village) => {
    setSelectedVillageId(village.id);
    navigate(`/villages?selected=${village.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-gray-100/95 text-gray-800 shadow-sm backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm">
              <Globe className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-[18px] text-gray-800">Digital Village Microplan Portal</h1>
              <p className="text-[11px] text-gray-500">Ganga River Basin Village Assessment</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 rounded-full bg-white/70 p-1 border border-gray-200 shadow-sm">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-[13px] shadow-sm">
              <Map className="w-4 h-4" />
              Home
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 text-[13px] transition-colors"
              onClick={() => navigate("/villages")}
            >
              <List className="w-4 h-4" />
              All Villages
            </button>
          </nav>
          <div className="flex items-center gap-3 ml-2 shrink-0">
            {partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="h-11 w-20 md:w-24 rounded-md bg-transparent flex items-center justify-center overflow-hidden"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-10 w-full object-contain opacity-95 mix-blend-multiply"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[340px] overflow-hidden">
        <ImageWithFallback
          src={heroImage}
          alt="Ganga River Basin"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-screen-2xl mx-auto px-6 w-full">
            <div className="max-w-lg">
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-[12px] rounded-full mb-3 backdrop-blur-sm">
                Namami Gange Programme
              </span>
              <h2 className="text-white text-[32px]" style={{ lineHeight: 1.2 }}>
                Village Microplaning
              </h2>
              <p className="text-blue-100 text-[14px] mt-3 leading-relaxed">
                Comprehensive assessment of 38 villages along the Ganga River basin, covering 9
                key development categories across 11 states.
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => navigate("/villages")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-800 rounded-lg text-[13px] hover:bg-blue-50 transition-colors"
                >
                  Explore Villages
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#map-section"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg text-[13px] hover:bg-white/30 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  View Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[22px] text-blue-800">{villages.length}</p>
              <p className="text-[12px] text-gray-500">Villages Surveyed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[22px] text-green-800">{totalPop.toLocaleString()}</p>
              <p className="text-[12px] text-gray-500">Total Population</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[22px] text-amber-800">{totalHH.toLocaleString()}</p>
              <p className="text-[12px] text-gray-500">Households Covered</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[22px] text-purple-800">{avgScore}/5</p>
              <p className="text-[12px] text-gray-500">Avg. Village Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* About + Focus Areas */}
      <section className="max-w-screen-2xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-gray-800 text-[18px] mb-3">About the Microplan</h3>
          <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
            The Ganga River Basin Microplan is a comprehensive assessment initiative that evaluates
            villages along the river on critical parameters including community awareness, sanitation,
            agriculture practices, biodiversity conservation, renewable energy adoption, and more. Each
            village is scored on a 1-5 scale across 9 categories, enabling targeted interventions and
            solutions.
          </p>
          <p className="text-[14px] text-gray-600 leading-relaxed">
            Spanning across {statesSet.size} states - {Array.from(statesSet).join(", ")} - this portal
            provides an interactive GIS-based view to explore village-level data, view assessment scores,
            and access recommended solutions based on each village's unique profile.
          </p>
        </div>
        <div>
          <h3 className="text-gray-800 text-[18px] mb-3">Key Focus Areas</h3>
          <div className="grid grid-cols-2 gap-3">
            {focusAreas.map((area) => (
              <div
                key={area.label}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${area.color}`}>
                  <area.icon className="w-4 h-4" />
                </div>
                <span className="text-[13px] text-gray-700">{area.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <p className="text-[13px] text-blue-700">
              <strong>9 Assessment Categories</strong> with expandable sub-indicators and
              tailored solutions mapped to Low / Medium / High score levels.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <h3 className="text-gray-800 text-[18px] mb-4">From the Ganga River Basin</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photoGallery.map((photo, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[4/3]">
                <ImageWithFallback
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2.5 left-3 right-3 text-[12px] text-white">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section id="map-section" className="max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-800 text-[18px]">Interactive Village Map</h3>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Click any village point to navigate to its detailed assessment
            </p>
          </div>
          <button
            onClick={() => navigate("/villages")}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] hover:bg-blue-700 transition-colors"
          >
            <List className="w-4 h-4" />
            View All Villages
          </button>
        </div>
        <div className="h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <MapView selectedVillageId={selectedVillageId} onVillageClick={handleVillageClick} />
        </div>
      </section>

      {/* Top Villages Preview */}
      <section className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <h3 className="text-gray-800 text-[18px] mb-4">Top-Scored Villages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...villages]
              .sort((a, b) => b.overallScore - a.overallScore)
              .slice(0, 5)
              .map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/villages?selected=${v.id}`)}
                >
                  <div className="w-full h-28 rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={v.images[0]}
                      alt={v.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[14px] text-gray-800">{v.name}</h4>
                  <p className="text-[12px] text-gray-500">{v.district}, {v.state}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          v.overallScore >= 4 ? "bg-green-500" : v.overallScore >= 3 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${(v.overallScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-gray-600">{v.overallScore}/5</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-gray-200/95 text-gray-700 py-6 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-5">
            {partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="h-12 w-28 md:w-32 rounded-md bg-transparent flex items-center justify-center px-2"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-10 w-full object-contain opacity-90 mix-blend-multiply"
                  loading="eager"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-gray-600">
            <span>Digital Village Microplan Portal - Ganga River Basin Village Assessment</span>
            <span>
              {statesSet.size} States &middot; {villages.length} Villages &middot; 9 Categories
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
