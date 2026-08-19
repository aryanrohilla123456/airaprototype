import { useState, useEffect, useRef } from 'react'

const RED = '#E50914'
const BG = '#141414'
const SURFACE = '#1F1F1F'
const CARD = '#2A2A2A'
const PF = "'Playfair Display', Georgia, serif"
const tmdb = (path: string) => `https://image.tmdb.org/t/p/w500/${path}.jpg`
const unsplash = (id: string, w = 400, h = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`

type Screen = 'splash' | 'login' | 'profiles' | 'main' | 'subscribe' | 'payment' | 'success'
type Tab = 'home' | 'search' | 'hot' | 'myaira'
type Plan = 'mobile' | 'standard' | 'premium'

interface Show {
  id: number; title: string; type: string; genres: string[]
  year: number; maturity: string; imdb?: number; dur?: string
  seasons?: number; eps?: number; progress?: number
  description: string; cast: string[]
  poster: string; fallback: string
  top10?: number; isNew?: boolean; premium?: boolean
  country?: string
}

// ── 36 Famous Shows / Movies ──────────────────────────────────────────────────
const SHOWS: Show[] = [
  // ACTION
  { id:1, title:'Money Heist', type:'Series', genres:['Action','Crime'], year:2017, maturity:'18+', imdb:8.3, seasons:5, eps:41, dur:'50 min', progress:65, country:'Spain',
    poster:'reEMJA1uzscCbkpeRJeTT2bjqUp', fallback:'135deg,#8B0000,#CC2222',
    description:'A mysterious mastermind called The Professor recruits eight thieves to carry out the most elaborate heist in history — seizing the Royal Mint of Spain.',
    cast:['Álvaro Morte','Úrsula Corberó','Itziar Ituño','Pedro Alonso'], top10:1 },
  { id:2, title:'The Dark Knight', type:'Movie', genres:['Action','Crime'], year:2008, maturity:'13+', imdb:9.0, dur:'2h 32m', country:'USA',
    poster:'qJ2tW6WMUDux911r6m7haRef0WH', fallback:'135deg,#0d0d0d,#1a1a1a',
    description:'Batman raises the stakes in his war on crime. With the Joker unleashing chaos on Gotham, Batman must confront everything he believes.',
    cast:['Christian Bale','Heath Ledger','Aaron Eckhart','Gary Oldman'], top10:5 },
  { id:3, title:'Avengers: Endgame', type:'Movie', genres:['Action','Sci-Fi'], year:2019, maturity:'13+', imdb:8.4, dur:'3h 1m', country:'USA',
    poster:'or06FN3Dka5tukK1e9sl16pB3iy', fallback:'135deg,#0d1117,#1a2332',
    description:"After Thanos wiped out half of all life, the Avengers assemble one final time to undo his actions and restore order to the universe.",
    cast:['Robert Downey Jr.','Chris Evans','Scarlett Johansson','Chris Hemsworth'] },
  { id:4, title:'John Wick: Chapter 4', type:'Movie', genres:['Action','Thriller'], year:2023, maturity:'18+', imdb:7.7, dur:'2h 49m', country:'USA',
    poster:'vZloFAK7NmvMGKE7VkF5UHaz0I', fallback:'135deg,#0a0a0a,#1a1a2e',
    description:'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, he must face off against a deadly new enemy.',
    cast:['Keanu Reeves','Donnie Yen','Bill Skarsgård','Laurence Fishburne'] },

  // CRIME / THRILLER
  { id:5, title:'Breaking Bad', type:'Series', genres:['Crime','Drama','Thriller'], year:2008, maturity:'18+', imdb:9.5, seasons:5, eps:62, dur:'49 min', progress:30, country:'USA',
    poster:'ggFHVNu6YYI5L9pCfOacjizRGt', fallback:'135deg,#0d1a00,#1a3300',
    description:'A high school chemistry teacher diagnosed with inoperable cancer turns to manufacturing methamphetamine with a former student to secure his family\'s future.',
    cast:['Bryan Cranston','Aaron Paul','Anna Gunn','Dean Norris'], top10:2 },
  { id:6, title:'Peaky Blinders', type:'Series', genres:['Crime','Drama'], year:2013, maturity:'18+', imdb:8.8, seasons:6, eps:36, dur:'60 min', progress:80, country:'UK',
    poster:'vUUqzWa2LnHIVqkaKVn3nyfVnBs', fallback:'135deg,#0a0a14,#14141e',
    description:'A gangster family epic set in 1919 Birmingham, England — centering on the razor-gang Peaky Blinders and their ruthlessly ambitious leader Tommy Shelby.',
    cast:['Cillian Murphy','Paul Anderson','Helen McCrory','Tom Hardy'], top10:3 },
  { id:7, title:'Squid Game', type:'Series', genres:['Thriller','Crime','Drama'], year:2021, maturity:'18+', imdb:8.0, seasons:2, eps:19, dur:'55 min', country:'South Korea',
    poster:'dDlEmu3EZ0Pgg93K2SVNLCjCSvE', fallback:'135deg,#0d1a0d,#003322',
    description:'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games with life-or-death stakes for a ₩45.6 billion prize.',
    cast:['Lee Jung-jae','Park Hae-soo','Wi Ha-jun','HoYeon Jung'], top10:4, isNew:true },
  { id:8, title:'Narcos', type:'Series', genres:['Crime','Drama'], year:2015, maturity:'18+', imdb:8.8, seasons:3, eps:30, dur:'49 min', country:'Colombia/USA',
    poster:'rTmal9fDbwh5F0waol2hq35U4ah', fallback:'135deg,#1a1000,#2a1800',
    description:"The true story of Colombia's violent drug cartels — following DEA agent Steve Murphy as he hunts down Pablo Escobar and the Medellín cartel.",
    cast:['Wagner Moura','Boyd Holbrook','Pedro Pascal','Alberto Ammann'] },
  { id:9, title:'Mindhunter', type:'Series', genres:['Crime','Thriller','Drama'], year:2017, maturity:'18+', imdb:8.6, seasons:2, eps:19, dur:'55 min', country:'USA',
    poster:'jt6BHVdF8iQBKtFIfGhkAFUU4nK', fallback:'135deg,#0a0a0a,#1a0d00',
    description:'In the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder, interviewing imprisoned serial killers.',
    cast:['Jonathan Groff','Holt McCallany','Anna Torv','Hannah Gross'] },
  { id:10, title:'The Godfather', type:'Movie', genres:['Crime','Drama'], year:1972, maturity:'18+', imdb:9.2, dur:'2h 55m', country:'USA',
    poster:'3bhkrj58Vtu7enYsLorgD1p0jjT', fallback:'135deg,#0d0d00,#1a1500',
    description:'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son, setting off a chain of brutal events.',
    cast:['Marlon Brando','Al Pacino','James Caan','Diane Keaton'] },
  { id:11, title:'Ozark', type:'Series', genres:['Crime','Thriller','Drama'], year:2017, maturity:'18+', imdb:8.4, seasons:4, eps:44, dur:'60 min', progress:45, country:'USA',
    poster:'mwGGPHaXgAFbJVlrAqJjhzEOhWC', fallback:'135deg,#000a14,#000d1a',
    description:'A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.',
    cast:['Jason Bateman','Laura Linney','Sofia Hublitz','Julia Garner'] },

  // SCI-FI
  { id:12, title:'Stranger Things', type:'Series', genres:['Sci-Fi','Horror','Drama'], year:2016, maturity:'16+', imdb:8.7, seasons:4, eps:42, dur:'51 min', progress:55, country:'USA',
    poster:'49WJfeN0moxb9IPfGn8AIqMGskD', fallback:'135deg,#0a0a14,#14001a',
    description:'When a boy vanishes, his friends, family and local police discover a series of extraordinary mysteries involving secret government experiments and supernatural forces.',
    cast:['Millie Bobby Brown','Finn Wolfhard','Winona Ryder','David Harbour'], top10:6 },
  { id:13, title:'Dark', type:'Series', genres:['Sci-Fi','Thriller','Mystery'], year:2017, maturity:'16+', imdb:8.8, seasons:3, eps:26, dur:'60 min', country:'Germany',
    poster:'apbrbWs5wheK7VFlRUF9B0silRC', fallback:'135deg,#050510,#0a0a1a',
    description:'Two missing children expose the double lives and dark secrets of four interconnected families spanning three time periods in a German town.',
    cast:['Louis Hofmann','Oliver Masucci','Karoline Eichhorn','Lisa Vicari'] },
  { id:14, title:'Inception', type:'Movie', genres:['Sci-Fi','Action','Thriller'], year:2010, maturity:'13+', imdb:8.8, dur:'2h 28m', country:'USA/UK',
    poster:'9gk7adHYeDvHkCSEqAvQNLV5Uge', fallback:'135deg,#05050d,#0a0a1a',
    description:'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea in a target\'s mind.',
    cast:['Leonardo DiCaprio','Joseph Gordon-Levitt','Elliot Page','Tom Hardy'], top10:7 },
  { id:15, title:'Interstellar', type:'Movie', genres:['Sci-Fi','Drama','Adventure'], year:2014, maturity:'PG', imdb:8.6, dur:'2h 49m', country:'USA/UK',
    poster:'gEU2QniE6E77NI6lCU6MxlNBvIx', fallback:'135deg,#030314,#050524',
    description:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
    cast:['Matthew McConaughey','Anne Hathaway','Jessica Chastain','Michael Caine'] },
  { id:16, title:'The Boys', type:'Series', genres:['Action','Thriller','Comedy'], year:2019, maturity:'18+', imdb:8.7, seasons:4, eps:40, dur:'55 min', country:'USA',
    poster:'stTEycfG9928HYGEISBFaG1ngjM', fallback:'135deg,#1a0000,#260000',
    description:'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers. In a world where heroes are as popular as celebrities.',
    cast:['Karl Urban','Jack Quaid','Antony Starr','Erin Moriarty'], isNew:true },
  { id:17, title:'Black Mirror', type:'Series', genres:['Sci-Fi','Thriller','Drama'], year:2011, maturity:'18+', imdb:8.7, seasons:6, eps:27, dur:'60 min', country:'UK',
    poster:'7PRddO7z7MCPi5tEEcNPnJd2eES', fallback:'135deg,#000000,#0a0a0a',
    description:'An anthology series exploring a twisted, high-tech near-future where humanity\'s greatest innovations and darkest instincts collide.',
    cast:['Various Performers'], premium:true },

  // HORROR
  { id:18, title:'The Haunting of Hill House', type:'Series', genres:['Horror','Drama'], year:2018, maturity:'18+', imdb:8.6, seasons:1, eps:10, dur:'60 min', country:'USA',
    poster:'', fallback:'135deg,#0a0000,#140a0a',
    description:'A family confronts haunting memories of their old home and the terrifying supernatural events that drove them from it decades ago.',
    cast:['Michiel Huisman','Elizabeth Reaser','Oliver Jackson-Cohen','Kate Siegel'] },
  { id:19, title:'Get Out', type:'Movie', genres:['Horror','Thriller','Mystery'], year:2017, maturity:'18+', imdb:7.7, dur:'1h 44m', country:'USA',
    poster:'tFXcEccSQMf3lfhfXKSU9iRBpa3', fallback:'135deg,#0d0d00,#1a1a00',
    description:"A young man visits his girlfriend's family estate for the weekend, where unsettling discoveries slowly reveal a disturbing truth.",
    cast:['Daniel Kaluuya','Allison Williams','Bradley Whitford','Catherine Keener'] },

  // DRAMA
  { id:20, title:'Game of Thrones', type:'Series', genres:['Drama','Fantasy','Action'], year:2011, maturity:'18+', imdb:9.3, seasons:8, eps:73, dur:'57 min', country:'USA/UK',
    poster:'u3bZgnGQ9T01sWNhyveQz0wH0Hl', fallback:'135deg,#0d0d00,#1a1000',
    description:'Nine noble families fight for control over the mythical lands of Westeros while an ancient enemy returns after being dormant for millennia.',
    cast:['Emilia Clarke','Kit Harington','Peter Dinklage','Lena Headey'] },
  { id:21, title:'The Crown', type:'Series', genres:['Drama','History'], year:2016, maturity:'13+', imdb:8.7, seasons:6, eps:60, dur:'60 min', country:'UK',
    poster:'1M876KPjulVwppEpldhdc8V4o68', fallback:'135deg,#1a1400,#2a2000',
    description:"Follows the political rivalries and romances of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    cast:['Claire Foy','Matt Smith','Olivia Colman','Helena Bonham Carter'] },
  { id:22, title:'Succession', type:'Series', genres:['Drama','Comedy'], year:2018, maturity:'18+', imdb:8.8, seasons:4, eps:39, dur:'60 min', progress:42, country:'USA',
    poster:'', fallback:'135deg,#0d0d0d,#1a1a14',
    description:"The Roy family controls the world's biggest media empire. But the company's future is complicated by their spectacular dysfunction.",
    cast:['Brian Cox','Jeremy Strong','Sarah Snook','Kieran Culkin'] },
  { id:23, title:'The Shawshank Redemption', type:'Movie', genres:['Drama'], year:1994, maturity:'15+', imdb:9.3, dur:'2h 22m', country:'USA',
    poster:'q6y0Go1tsGEsmtFryDOJo3dEmqu', fallback:'135deg,#0d0800,#1a1000',
    description:'Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency — and one daring escape plan.',
    cast:['Tim Robbins','Morgan Freeman','Bob Gunton','William Sadler'] },
  { id:24, title:'Parasite', type:'Movie', genres:['Drama','Thriller','Comedy'], year:2019, maturity:'15+', imdb:8.5, dur:'2h 12m', country:'South Korea',
    poster:'7IiTTgloJzvGI1TAYymCfbfl3vT', fallback:'135deg,#0a0a0a,#14140a',
    description:'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    cast:['Song Kang-ho','Lee Sun-kyun','Cho Yeo-jeong','Choi Woo-shik'], top10:8 },

  // ROMANCE
  { id:25, title:'La La Land', type:'Movie', genres:['Romance','Drama','Musical'], year:2016, maturity:'PG', imdb:8.0, dur:'2h 8m', country:'USA',
    poster:'uDO8zWDhfWwoFdKS4fzkUJt0Rf0', fallback:'135deg,#14001a,#200d2a',
    description:'A pianist and an aspiring actress fall in love in Los Angeles while struggling to reconcile their dreams with the hard realities of life.',
    cast:['Ryan Gosling','Emma Stone','John Legend','J.K. Simmons'] },
  { id:26, title:'Bridgerton', type:'Series', genres:['Romance','Drama'], year:2020, maturity:'13+', imdb:7.3, seasons:3, eps:24, dur:'60 min', country:'UK/USA',
    poster:'', fallback:'135deg,#14001a,#1a0020',
    description:'Wealth, lust and betrayal set against the backdrop of Regency Era England, seen through the eyes of the powerful Bridgerton family.',
    cast:['Phoebe Dynevor','Regé-Jean Page','Nicola Coughlan','Jonathan Bailey'], isNew:true },

  // COMEDY
  { id:27, title:'The Office', type:'Series', genres:['Comedy'], year:2005, maturity:'13+', imdb:9.0, seasons:9, eps:188, dur:'22 min', country:'USA',
    poster:'qWnJzyZhyy74gjpSjIXWmuk0ifX', fallback:'135deg,#002080,#001060',
    description:'A mockumentary about the daily lives of office employees at a paper company — and the bumbling, oblivious regional manager who leads them.',
    cast:['Steve Carell','Rainn Wilson','John Krasinski','Jenna Fischer'] },
  { id:28, title:'Friends', type:'Series', genres:['Comedy','Romance'], year:1994, maturity:'13+', imdb:8.9, seasons:10, eps:236, dur:'22 min', country:'USA',
    poster:'f496cm9enuEsZkSPzCwnTESEK5s', fallback:'135deg,#1a0000,#2a0a00',
    description:'Six twenty-something friends living in Manhattan navigate relationships, careers, and life — with a lot of coffee and a whole lot of laughs.',
    cast:['Jennifer Aniston','Courteney Cox','Lisa Kudrow','Matt LeBlanc'] },
  { id:29, title:'Knives Out', type:'Movie', genres:['Comedy','Crime','Mystery'], year:2019, maturity:'13+', imdb:7.9, dur:'2h 10m', country:'USA',
    poster:'pThyQovXQrws2Q07e9XX9muE0LR', fallback:'135deg,#0d0d0d,#1a1500',
    description:'Detective Benoit Blanc investigates the death of a wealthy crime novelist, uncovering a tangle of lies among his eccentric family.',
    cast:['Daniel Craig','Ana de Armas','Chris Evans','Jamie Lee Curtis'] },

  // ANIMATION
  { id:30, title:'Spider-Man: Into the Spider-Verse', type:'Movie', genres:['Animation','Action','Sci-Fi'], year:2018, maturity:'PG', imdb:8.4, dur:'1h 57m', country:'USA',
    poster:'iiZZdoQBEYBv6id8su7ImL0oCbD', fallback:'135deg,#001a4d,#000d26',
    description:'Teen Miles Morales becomes the Spider-Man of his universe and must join five spider-powered individuals from other dimensions to save them all.',
    cast:['Shameik Moore','Jake Johnson','Hailee Steinfeld','Mahershala Ali'], top10:9 },
  { id:31, title:'Arcane', type:'Series', genres:['Animation','Action','Fantasy'], year:2021, maturity:'16+', imdb:9.0, seasons:2, eps:18, dur:'40 min', country:'France/USA',
    poster:'', fallback:'135deg,#001a26,#000d1a',
    description:'Set in the utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic champions — and a city torn apart.',
    cast:['Hailee Steinfeld','Ella Purnell','Kevin Alejandro','Katie Leung'], isNew:true },
  { id:32, title:'Coco', type:'Movie', genres:['Animation','Family','Drama'], year:2017, maturity:'PG', imdb:8.4, dur:'1h 45m', country:'USA',
    poster:'gGEsBPAijhVUFoiNpgZXqRVWJt2', fallback:'135deg,#2a0d00,#400d00',
    description:'Aspiring musician Miguel, confronted with his family\'s ban on music, enters the magical Land of the Dead to find his great-great-grandfather.',
    cast:['Anthony Gonzalez','Gael García Bernal','Benjamin Bratt','Alanna Ubach'] },

  // DOCUMENTARY / SPORTS
  { id:33, title:'The Last Dance', type:'Documentary', genres:['Sports','Documentary'], year:2020, maturity:'13+', eps:10, dur:'55 min', country:'USA',
    poster:'', fallback:'135deg,#001a00,#002a00',
    description:"An unprecedented look at the 1997-98 Chicago Bulls featuring never-before-seen footage, revealing the inside story of Michael Jordan's final championship season.",
    cast:['Michael Jordan','Scottie Pippen','Phil Jackson','Dennis Rodman'], top10:10, premium:true },
  { id:34, title:'Our Planet', type:'Documentary', genres:['Documentary','Nature'], year:2019, maturity:'G', seasons:1, eps:8, dur:'50 min', country:'UK',
    poster:'', fallback:'135deg,#001a0d,#002a14',
    description:'David Attenborough presents a breathtaking series showcasing the stunning diversity of the natural world before it is lost forever.',
    cast:['Narrated by David Attenborough'], premium:true },
  { id:35, title:'Formula 1: Drive to Survive', type:'Documentary', genres:['Sports','Documentary'], year:2019, maturity:'13+', imdb:8.3, seasons:6, eps:54, dur:'45 min', country:'UK',
    poster:'', fallback:'135deg,#1a0000,#2a0000',
    description:'Formula 1 drivers, managers and team owners live life in the fast lane — on and off the track — in this docuseries.',
    cast:['Lewis Hamilton','Max Verstappen','Charles Leclerc','Lando Norris'] },
  { id:36, title:'The Witcher', type:'Series', genres:['Fantasy','Action','Drama'], year:2019, maturity:'18+', imdb:8.2, seasons:3, eps:24, dur:'60 min', country:'UK/USA',
    poster:'7vjaCdMw15FEbXyLQTVa04URsPm', fallback:'135deg,#0d0007,#1a0010',
    description:'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
    cast:['Henry Cavill','Freya Allan','Anya Chalotra','Joey Batey'] },
]

const PLANS = [
  { id:'mobile' as Plan, name:'Mobile', price:9.99, yearPrice:7.99, color:'#888', quality:'720p HD', devices:1, features:['Phone & tablet only','720p HD quality','1 screen at a time','No downloads'] },
  { id:'standard' as Plan, name:'Standard', price:15.49, yearPrice:12.39, color:'#4A9DFF', quality:'1080p FHD', devices:2, features:['Any device','Full HD 1080p','2 screens at once','Downloads on 2 devices'], badge:'POPULAR' },
  { id:'premium' as Plan, name:'Premium', price:22.99, yearPrice:18.39, color:RED, quality:'4K+HDR', devices:4, features:['Any device','4K Ultra HD + HDR','4 screens at once','Downloads on 6 devices'], badge:'BEST VALUE' },
]
const PROFILES = [
  { name:'You', emoji:'🎬', color:RED, plan:'Standard' },
  { name:'Partner', emoji:'🍿', color:'#4A9DFF', plan:'' },
  { name:'Kids', emoji:'⭐', color:'#F5A623', plan:'Kids', kid:true },
  { name:'+ Add', emoji:'+', color:'#333', plan:'', add:true },
]
const LANGS = [
  { code:'EN', label:'English' },
  { code:'AR', label:'العربية' },
  { code:'UR', label:'اردو' },
  { code:'HI', label:'हिन्दी' },
  { code:'TR', label:'Türkçe' },
]
const SPEEDS = ['0.5×','0.75×','1×','1.25×','1.5×','2×']
const EPISODES = [
  { num:1, title:'Blackout', dur:'52 min', watched:true },
  { num:2, title:'The Contact', dur:'49 min', watched:true },
  { num:3, title:'Shadow Protocol', dur:'55 min', current:true },
  { num:4, title:'Burned', dur:'51 min' },
  { num:5, title:'Dead Drop', dur:'58 min' },
  { num:6, title:'Final Night', dur:'62 min' },
]
const ALL_GENRES = ['All','Action','Crime','Thriller','Sci-Fi','Fantasy','Horror','Drama','Romance','Comedy','Animation','Documentary','Sports']
const byGenre = (g: string) => g === 'All' ? SHOWS : SHOWS.filter(s => s.genres.includes(g))
const matchPct = (s: Show) => Math.min(99, Math.round((s.imdb || 7.5) * 10.8 + 2))

// ── Poster with fallback ───────────────────────────────────────────────────────
function Poster({ show, className = '', style = {} }: { show: Show; className?: string; style?: React.CSSProperties }) {
  const [err, setErr] = useState(false)
  const src = show.poster ? tmdb(show.poster) : ''
  const grad = `linear-gradient(${show.fallback})`
  if (!src || err) {
    return (
      <div className={className} style={{ ...style, background: grad, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'8px' }}>
        <span style={{ color:'rgba(255,255,255,0.85)', fontSize:'11px', fontWeight:700, textAlign:'center', textShadow:'0 1px 4px rgba(0,0,0,0.8)', lineHeight:1.25 }}>{show.title}</span>
      </div>
    )
  }
  return <img src={src} alt={show.title} className={className} style={style} loading="lazy" onError={() => setErr(true)} />
}

// ── Phone Frame — iPhone 17 Pro Max (440 × 960) ───────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  const W = 440, H = 960
  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
                  background:'radial-gradient(ellipse at 50% 30%, #1a0505 0%, #050505 70%)' }}>
      {/* left hardware buttons only — no right slider */}
      <div style={{ position:'relative', width:`min(calc((100vh - 16px) * ${W} / ${H}), calc(100vw - 16px))`,
                    height:`min(calc((100vw - 16px) * ${H} / ${W}), calc(100vh - 16px))` }}>
        {/* volume up */}
        <div style={{ position:'absolute', left:'-9px', top:'22%', width:'4px', height:'6.5%', background:'#2a2a2a', borderRadius:'2px 0 0 2px' }}/>
        {/* volume down */}
        <div style={{ position:'absolute', left:'-9px', top:'30%', width:'4px', height:'6.5%', background:'#2a2a2a', borderRadius:'2px 0 0 2px' }}/>

        <div className="relative overflow-hidden h-full w-full"
             style={{ background:BG, borderRadius:'min(54px,5.5vw)',
                      border:'12px solid #1c1c1c',
                      boxShadow:'0 0 0 1px #2a2a2a, 0 50px 120px rgba(0,0,0,0.97), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          {/* Dynamic Island — single pill with one camera dot */}
          <div style={{ position:'absolute', top:'13px', left:'50%', transform:'translateX(-50%)',
                        width:'116px', height:'34px', background:'#000', borderRadius:'20px', zIndex:200,
                        display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:'10px' }}>
            {/* single front camera */}
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#111', border:'1px solid #1a1a1a' }}/>
          </div>
          {/* Home indicator */}
          <div style={{ position:'absolute', bottom:'9px', left:'50%', transform:'translateX(-50%)', width:'138px', height:'5px', background:'rgba(255,255,255,0.22)', borderRadius:'3px', zIndex:200 }} />
          {/* titanium sheen */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 60%)', pointerEvents:'none', zIndex:199 }}/>
          <div className="h-full relative">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Global Toast ──────────────────────────────────────────────────────────────
let _showToast: ((msg: string, icon?: string) => void) | null = null
const toast = (msg: string, icon = '✓') => _showToast?.(msg, icon)

function Toast() {
  const [items, setItems] = useState<{ id: number; msg: string; icon: string }[]>([])
  useEffect(() => {
    _showToast = (msg, icon = '✓') => {
      const id = Date.now()
      setItems(p => [...p.slice(-2), { id, msg, icon }])
      setTimeout(() => setItems(p => p.filter(x => x.id !== id)), 2800)
    }
    return () => { _showToast = null }
  }, [])
  return (
    <div style={{ position:'absolute', top:'62px', left:'12px', right:'12px', zIndex:999, pointerEvents:'none', display:'flex', flexDirection:'column', gap:'6px' }}>
      {items.map(t => (
        <div key={t.id} className="animate-fade-up flex items-center gap-2 px-4 py-2.5 rounded-xl"
             style={{ background:'rgba(30,30,30,0.96)', backdropFilter:'blur(20px)', border:'1px solid #2a2a2a', boxShadow:'0 8px 30px rgba(0,0,0,0.6)' }}>
          <span style={{ fontSize:'15px' }}>{t.icon}</span>
          <span style={{ color:'white', fontSize:'13px', fontWeight:500 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

// ── Status Bar ────────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-14 pb-1">
      <span style={{ color:'white', fontSize:'15px', fontWeight:700 }}>9:41</span>
      <div className="flex items-center gap-1.5">
        {[3,4,4].map((h,i)=>( <div key={i} style={{ width:'3px', height:`${h+i*2}px`, background:`rgba(255,255,255,${0.4+i*0.3})`, borderRadius:'1px' }} /> ))}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white" className="mx-1">
          <path d="M8 0C4.7 0 1.7 1.3 0 3.3L8 12l8-8.7C14.3 1.3 11.3 0 8 0z"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
          <path d="M23 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }: { tab:Tab; setTab:(t:Tab)=>void }) {
  const items: { id:Tab; label:string; path:string }[] = [
    { id:'home', label:'Home', path:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
    { id:'search', label:'Search', path:'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z' },
    { id:'hot', label:'New & Hot', path:'' },
    { id:'myaira', label:'My AIRA', path:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 110 8 4 4 0 010-8z' },
  ]
  return (
    <div className="flex items-center justify-around px-2 pt-2 pb-6"
         style={{ background:`${BG}f4`, borderTop:'1px solid #222', backdropFilter:'blur(20px)' }}>
      {items.map(t => {
        const a = tab === t.id
        return (
          <button key={t.id} onClick={()=>setTab(t.id)} className="flex flex-col items-center gap-1 py-1 px-3">
            {t.id === 'hot'
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? RED : 'none'} stroke={a ? RED : '#666'} strokeWidth="1.8" strokeLinecap="round"><path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-5-5-9-5-9z"/><path d="M12 14c0 0-2-1.5-2-3s1-2.5 2-3c1 .5 2 1.5 2 3s-2 3-2 3z" fill={a ? 'white' : 'none'} stroke={a ? 'white' : '#555'}/></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? 'white' : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {t.path.split(' M').map((p,i) => <path key={i} d={(i?'M':'')+p}/>)}
                </svg>
            }
            <span style={{ fontSize:'10px', color:a?'white':'#555', fontWeight:a?600:400 }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Card Components ───────────────────────────────────────────────────────────
function PCard({ show, onSelect, w=116 }: { show:Show; onSelect:(s:Show)=>void; w?:number }) {
  return (
    <button className="relative flex-shrink-0 text-left active:opacity-75" style={{ width:w+'px' }} onClick={()=>onSelect(show)}>
      <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio:'2/3', background:CARD }}>
        <Poster show={show} className="w-full h-full object-cover" style={{ display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.65) 100%)' }} />
        {show.top10 && <div style={{ position:'absolute', top:'6px', left:'6px', width:'26px', height:'26px', background:RED, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, fontSize:'11px' }}>{show.top10}</div>}
        {show.isNew && !show.top10 && <span style={{ position:'absolute', top:'6px', left:'6px', fontSize:'9px', fontWeight:800, padding:'2px 6px', borderRadius:'4px', background:RED, color:'white' }}>NEW</span>}
        {show.premium && <span style={{ position:'absolute', top:'6px', right:'6px', fontSize:'12px' }}>🔒</span>}
        {show.country && <span style={{ position:'absolute', bottom:'6px', left:'6px', fontSize:'9px', color:'rgba(255,255,255,0.6)' }}>{show.country}</span>}
      </div>
      <p className="text-white font-medium mt-1.5 leading-tight line-clamp-2" style={{ fontSize:'11px' }}>{show.title}</p>
    </button>
  )
}

function WCard({ show, onSelect }: { show:Show; onSelect:(s:Show)=>void }) {
  return (
    <button className="relative flex-shrink-0 text-left active:opacity-75" style={{ width:'185px' }} onClick={()=>onSelect(show)}>
      <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio:'16/9', background:CARD }}>
        <Poster show={show} className="w-full h-full object-cover" style={{ display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(4px)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ marginLeft:'2px' }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        {show.progress != null && (
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:'rgba(255,255,255,0.1)' }}>
            <div style={{ width:`${show.progress}%`, height:'100%', background:RED }} />
          </div>
        )}
      </div>
      <p className="text-white font-medium mt-1.5 line-clamp-1" style={{ fontSize:'12px' }}>{show.title}</p>
      {show.progress != null && <p style={{ color:'#666', fontSize:'10px', marginTop:'2px' }}>{show.progress}% watched</p>}
    </button>
  )
}

function Row({ title, shows, wide, onSelect }: { title:string; shows:Show[]; wide?:boolean; onSelect:(s:Show)=>void }) {
  if (!shows.length) return null
  return (
    <div className="mb-5">
      <h3 className="font-semibold px-4 mb-2.5" style={{ color:'white', fontSize:'15px' }}>{title}</h3>
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4 pb-1">
        {wide ? shows.map(s=><WCard key={s.id} show={s} onSelect={onSelect}/>) : shows.map(s=><PCard key={s.id} show={s} onSelect={onSelect}/>)}
      </div>
    </div>
  )
}

// ── Splash ────────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone:()=>void }) {
  const [vis,setVis]=useState(false); const [bar,setBar]=useState(0)
  useEffect(()=>{
    setTimeout(()=>setVis(true),200)
    const id=setInterval(()=>setBar(p=>Math.min(p+2,100)),50)
    setTimeout(()=>{clearInterval(id);onDone()},2800)
    return()=>clearInterval(id)
  },[onDone])
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background:`radial-gradient(ellipse at 50% 40%, #300 0%, ${BG} 65%)` }}>
      <div style={{ opacity:vis?1:0, transform:vis?'scale(1)':'scale(0.8)', transition:'all 0.8s cubic-bezier(0.34,1.56,0.64,1)', textAlign:'center' }}>
        <div style={{ fontFamily:PF, color:RED, fontSize:'68px', fontWeight:700, letterSpacing:'0.12em', textShadow:`0 0 50px ${RED}60` }}>AIRA</div>
        <div style={{ color:'#444', fontSize:'11px', letterSpacing:'0.5em', marginTop:'4px' }}>BY HANEDAN</div>
        <div style={{ width:'36px', height:'3px', background:RED, margin:'14px auto 0', borderRadius:'2px' }} />
        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', marginTop:'18px', letterSpacing:'0.1em' }}>Stream. Watch. Experience.</div>
      </div>
      <div style={{ position:'absolute', bottom:'80px', left:'60px', right:'60px' }}>
        <div style={{ height:'2px', background:'rgba(255,255,255,0.06)', borderRadius:'1px' }}>
          <div style={{ width:`${bar}%`, height:'100%', background:RED, borderRadius:'1px', boxShadow:`0 0 12px ${RED}`, transition:'width 0.05s linear' }} />
        </div>
        <p style={{ color:'#333', fontSize:'10px', textAlign:'center', marginTop:'10px', letterSpacing:'0.1em' }}>LOADING…</p>
      </div>
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin:()=>void }) {
  const [email,setEmail]=useState(''); const [pass,setPass]=useState('')
  const [foc,setFoc]=useState(''); const [showPass,setShowPass]=useState(false)
  const inp=(f:string):React.CSSProperties=>({ display:'block',width:'100%',marginTop:'8px',padding:'14px 16px',background:'#0F0F0F',border:`1.5px solid ${foc===f?RED:'#2a2a2a'}`,borderRadius:'8px',color:'white',fontSize:'15px',outline:'none',transition:'border-color 0.2s',fontFamily:'Inter,sans-serif' })
  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ background:BG }}>
      <div className="relative" style={{ height:'300px' }}>
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, #300 0%, #000 100%)` }} />
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:PF, color:RED, fontSize:'58px', fontWeight:700, letterSpacing:'0.12em', textShadow:`0 0 40px ${RED}70` }}>AIRA</div>
          <div style={{ color:'#444', fontSize:'11px', letterSpacing:'0.4em', marginTop:'4px' }}>BY HANEDAN</div>
        </div>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 50%, #141414 100%)' }} />
      </div>
      <div className="px-6 pt-6 pb-10">
        <h2 style={{ color:'white', fontSize:'24px', fontWeight:700, marginBottom:'4px' }}>Sign In</h2>
        <p style={{ color:'#555', fontSize:'13px', marginBottom:'24px' }}>Welcome back. Continue watching.</p>
        <div className="space-y-4">
          <div>
            <label style={{ color:'#666', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase' }}>Email or Phone</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFoc('e')} onBlur={()=>setFoc('')} placeholder="you@example.com" style={inp('e')}/>
          </div>
          <div>
            <div className="flex justify-between"><label style={{ color:'#666', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase' }}>Password</label><span style={{ color:RED, fontSize:'12px', cursor:'pointer' }}>Forgot?</span></div>
            <div className="relative">
              <input type={showPass?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} onFocus={()=>setFoc('p')} onBlur={()=>setFoc('')} placeholder="••••••••" style={inp('p')}/>
              <button onClick={()=>setShowPass(v=>!v)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', color:'#555', background:'transparent', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>{showPass?'HIDE':'SHOW'}</button>
            </div>
          </div>
        </div>
        <button onClick={onLogin} style={{ width:'100%', marginTop:'24px', padding:'16px', background:RED, color:'white', fontWeight:800, fontSize:'16px', borderRadius:'8px', border:'none', cursor:'pointer', letterSpacing:'0.04em' }}>SIGN IN</button>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0' }}>
          <div style={{ flex:1, height:'1px', background:'#222' }}/><span style={{ color:'#444', fontSize:'12px' }}>OR</span><div style={{ flex:1, height:'1px', background:'#222' }}/>
        </div>
        <div className="flex gap-3">
          {[['🔵','Google'],['⚫','Apple']].map(([ic,label])=>(
            <button key={label} onClick={onLogin} style={{ flex:1, padding:'13px', background:SURFACE, border:'1px solid #2a2a2a', borderRadius:'8px', color:'white', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>{ic} {label}</button>
          ))}
        </div>
        <p style={{ textAlign:'center', marginTop:'24px', color:'#555', fontSize:'13px' }}>New to AIRA?{' '}<span style={{ color:'white', fontWeight:600, cursor:'pointer' }} onClick={onLogin}>Start 30-Day Free Trial</span></p>
      </div>
    </div>
  )
}

// ── Profile Select ────────────────────────────────────────────────────────────
function ProfileSelect({ onSelect }: { onSelect:()=>void }) {
  const [pin,setPin]=useState<number|null>(null); const [code,setCode]=useState('')
  if (pin !== null) return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background:BG }}>
      <div style={{ fontFamily:PF, color:RED, fontSize:'22px', fontWeight:700, letterSpacing:'0.1em', marginBottom:'32px' }}>AIRA</div>
      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4" style={{ background:`${PROFILES[pin].color}20`, border:`2px solid ${PROFILES[pin].color}50` }}>{PROFILES[pin].emoji}</div>
      <h3 style={{ color:'white', fontSize:'18px', fontWeight:700, marginBottom:'6px' }}>{PROFILES[pin].name}</h3>
      <p style={{ color:'#555', fontSize:'13px', marginBottom:'28px' }}>Enter profile PIN</p>
      <div className="flex gap-3 mb-8">
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ width:'48px', height:'48px', borderRadius:'8px', background: code.length>i?`${PROFILES[pin].color}30`:'#0F0F0F', border:`1.5px solid ${code.length>i?PROFILES[pin].color:'#2a2a2a'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {code.length>i && <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:PROFILES[pin].color }} />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4" style={{ width:'220px' }}>
        {[1,2,3,4,5,6,7,8,9,'','0','⌫'].map((k,i)=>(
          <button key={i} onClick={()=>{
            if(k==='⌫'){setCode(c=>c.slice(0,-1));return}
            if(k==='')return
            const nw=code+k
            setCode(nw)
            if(nw.length===4){setTimeout(()=>{onSelect();setCode('');setPin(null)},300)}
          }} style={{ height:'52px', borderRadius:'10px', background:k===''?'transparent':SURFACE, border:`1px solid ${k===''?'transparent':'#2a2a2a'}`, color:'white', fontSize:'20px', fontWeight:600, cursor:k===''?'default':'pointer' }}>{k}</button>
        ))}
      </div>
      <button onClick={()=>{setPin(null);setCode('')}} style={{ color:'#444', fontSize:'13px', background:'transparent', border:'none', cursor:'pointer' }}>← Back to profiles</button>
    </div>
  )
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background:BG }}>
      <div style={{ fontFamily:PF, color:RED, fontSize:'22px', fontWeight:700, letterSpacing:'0.1em', marginBottom:'32px' }}>AIRA</div>
      <h2 style={{ color:'white', fontSize:'24px', fontWeight:700, marginBottom:'8px' }}>Who&apos;s watching?</h2>
      <p style={{ color:'#555', fontSize:'13px', marginBottom:'40px' }}>Select your profile</p>
      <div className="grid grid-cols-2 gap-4" style={{ width:'270px' }}>
        {PROFILES.map((p,i)=>(
          <button key={p.name} onClick={()=>{if(p.add){return};if(i===1||i===2){setPin(i)}else{onSelect()}}}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl active:scale-95"
                  style={{ background:p.add?'transparent':SURFACE, border:`1px solid ${p.add?'#1a1a1a':'#2a2a2a'}`, transition:'transform 0.1s' }}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                 style={{ background:`${p.color}20`, border:`2px solid ${p.color}50` }}>{p.emoji}</div>
            <span style={{ color:p.add?'#2a2a2a':'white', fontSize:'13px', fontWeight:500 }}>{p.name}</span>
            {p.plan && <span style={{ fontSize:'9px', padding:'2px 7px', borderRadius:'4px', background:p.kid?'#F5A623':RED, color:p.kid?'black':'white', fontWeight:700 }}>{p.plan}</span>}
            {(i===1||i===2) && !p.add && <span style={{ fontSize:'10px', color:'#444' }}>🔐 PIN</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────
const NOTIFS = [
  { id:1, icon:'🔴', title:'New Episode Available', body:'Breaking Bad · S5:E14 "Ozymandias"', time:'2m ago' },
  { id:2, icon:'🆕', title:'Just Added', body:'Squid Game Season 2 is now streaming', time:'1h ago' },
  { id:3, icon:'⭐', title:'Recommended', body:'Based on your watch history: Peaky Blinders', time:'3h ago' },
  { id:4, icon:'💳', title:'Subscription Renewal', body:'Your Standard plan renews in 3 days', time:'1d ago' },
  { id:5, icon:'🎬', title:'Coming Soon', body:'Neon City premieres Sep 6 — set a reminder', time:'2d ago' },
]

function HomeScreen({ onSelect, myList }: { onSelect:(s:Show)=>void; myList:number[] }) {
  const [filter,setFilter]=useState<'all'|'tv'|'movies'>('all')
  const [notifOpen,setNotifOpen]=useState(false)
  const hero=SHOWS[0]
  const filt=(shows:Show[])=>{
    if(filter==='tv') return shows.filter(s=>s.type==='Series')
    if(filter==='movies') return shows.filter(s=>s.type==='Movie')
    return shows
  }
  const continueW=filt(SHOWS.filter(s=>s.progress!=null))
  const top10=filt(SHOWS.filter(s=>s.top10)).sort((a,b)=>(a.top10||99)-(b.top10||99))
  const trending=filt(SHOWS).filter((_,i)=>i<12)
  const newReleases=filt(SHOWS.filter(s=>s.isNew||s.year>=2023))
  const recommended=filt(SHOWS.filter(s=>s.imdb&&s.imdb>=8.5))
  const recentlyAdded=filt([...SHOWS].reverse()).slice(0,8)
  const action=filt(SHOWS.filter(s=>s.genres.includes('Action')))
  const crime=filt(SHOWS.filter(s=>s.genres.includes('Crime')||s.genres.includes('Thriller')))
  const scifi=filt(SHOWS.filter(s=>s.genres.includes('Sci-Fi')))
  const drama=filt(SHOWS.filter(s=>s.genres.includes('Drama')))
  const comedy=filt(SHOWS.filter(s=>s.genres.includes('Comedy')))
  const docs=filt(SHOWS.filter(s=>s.genres.includes('Documentary')))
  const myListShows=SHOWS.filter(s=>myList.includes(s.id))

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background:BG }}>
      {/* Notification panel */}
      {notifOpen && (
        <div className="absolute inset-0 z-50" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} onClick={()=>setNotifOpen(false)}>
          <div className="absolute top-0 left-0 right-0 rounded-b-2xl overflow-hidden animate-fade-up"
               style={{ background:'#111', border:'1px solid #2a2a2a', borderTop:'none' }} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 pt-14 pb-3">
              <h3 style={{ color:'white', fontSize:'18px', fontWeight:700 }}>Notifications</h3>
              <button onClick={()=>setNotifOpen(false)} style={{ color:'#555', background:'transparent', border:'none', cursor:'pointer', fontSize:'16px' }}>✕</button>
            </div>
            {NOTIFS.map((n,i)=>(
              <div key={n.id} className="flex gap-3 px-4 py-3" style={{ borderTop:'1px solid #1a1a1a' }}>
                <span style={{ fontSize:'20px', width:'28px', flexShrink:0, marginTop:'2px' }}>{n.icon}</span>
                <div className="flex-1">
                  <p style={{ color:'white', fontSize:'13px', fontWeight:600 }}>{n.title}</p>
                  <p style={{ color:'#777', fontSize:'12px', marginTop:'1px' }}>{n.body}</p>
                  <p style={{ color:'#3a3a3a', fontSize:'10px', marginTop:'3px' }}>{n.time}</p>
                </div>
                {i===0 && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:RED, flexShrink:0, marginTop:'6px' }}/>}
              </div>
            ))}
            <button style={{ width:'100%', padding:'14px', background:'transparent', color:'#444', border:'none', borderTop:'1px solid #1a1a1a', cursor:'pointer', fontSize:'13px' }}
                    onClick={()=>{ toast('All notifications cleared','🗑️'); setNotifOpen(false) }}>
              Clear All Notifications
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative" style={{ height:'480px' }}>
        <Poster show={hero} className="absolute inset-0 w-full h-full object-cover" style={{ display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(20,20,20,0.15) 0%, transparent 20%, rgba(20,20,20,0.7) 60%, #141414 100%)' }} />
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4" style={{ paddingTop:'56px' }}>
          <div style={{ fontFamily:PF, color:RED, fontSize:'24px', fontWeight:700, letterSpacing:'0.1em' }}>AIRA</div>
          <div className="flex items-center gap-2.5">
            {(['TV Shows','Movies'] as const).map((l,i)=>{
              const active=(i===0&&filter==='tv')||(i===1&&filter==='movies')
              return (
                <button key={l} onClick={()=>setFilter(active?'all':(i===0?'tv':'movies'))}
                        style={{ color: active ? RED : 'white', background:'transparent', border:'none', cursor:'pointer', fontSize:'13px', fontWeight: active ? 700 : 500, borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', paddingBottom:'2px' }}>
                  {l}
                </button>
              )
            })}
            <button onClick={()=>setNotifOpen(v=>!v)} className="relative" style={{ background:'transparent', border:'none', cursor:'pointer', padding:'2px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <div style={{ position:'absolute', top:'-1px', right:'-1px', width:'8px', height:'8px', borderRadius:'50%', background:RED }} />
            </button>
          </div>
        </div>
        {/* Hero info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
          {hero.isNew && <span style={{ fontSize:'11px', color:RED, fontWeight:700, letterSpacing:'0.15em', display:'block', marginBottom:'6px' }}>NEW SERIES</span>}
          <h1 style={{ color:'white', fontSize:'32px', fontWeight:900, lineHeight:1.1, marginBottom:'10px', letterSpacing:'-0.02em' }}>{hero.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span style={{ color:'#46d369', fontSize:'12px', fontWeight:700 }}>{matchPct(hero)}% Match</span>
            <span style={{ color:'#aaa', fontSize:'12px' }}>{hero.year}</span>
            <span style={{ border:'1px solid #aaa', color:'#aaa', fontSize:'10px', padding:'1px 5px', borderRadius:'3px' }}>{hero.maturity}</span>
            {hero.seasons && <span style={{ color:'#aaa', fontSize:'12px' }}>{hero.seasons} Seasons</span>}
            <span style={{ background:'#333', color:'#ccc', fontSize:'10px', padding:'1px 6px', borderRadius:'3px', fontWeight:600 }}>HD</span>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>onSelect(hero)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 22px', background:'white', color:'black', fontWeight:800, fontSize:'15px', borderRadius:'6px', border:'none', cursor:'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black" style={{ marginLeft:'1px' }}><polygon points="5 3 19 12 5 21 5 3"/></svg>Play
            </button>
            <button onClick={()=>onSelect(hero)} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 20px', background:'rgba(109,109,110,0.65)', color:'white', fontWeight:700, fontSize:'15px', borderRadius:'6px', border:'none', cursor:'pointer', backdropFilter:'blur(8px)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>More Info
            </button>
          </div>
        </div>
      </div>

      {filter!=='all' && (
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <span style={{ color:RED, fontSize:'12px', fontWeight:700 }}>Showing: {filter==='tv'?'TV Shows Only':'Movies Only'}</span>
          <button onClick={()=>setFilter('all')} style={{ color:'#555', fontSize:'11px', background:'transparent', border:'none', cursor:'pointer' }}>Clear ✕</button>
        </div>
      )}

      <div className="mt-1">
        {continueW.length>0 && <Row title="Continue Watching" shows={continueW} wide onSelect={onSelect}/>}
        {top10.length>0 && <Row title="🏆 Top 10 Today" shows={top10} onSelect={onSelect}/>}
        <Row title="🔥 Trending Now" shows={trending} onSelect={onSelect}/>
        <Row title="✨ New Releases" shows={newReleases} onSelect={onSelect}/>
        <Row title="⭐ Recommended For You" shows={recommended} onSelect={onSelect}/>
        <Row title="🕐 Recently Added" shows={recentlyAdded} onSelect={onSelect}/>
        <Row title="Action & Adventure" shows={action} onSelect={onSelect}/>
        <Row title="Crime & Thriller" shows={crime} onSelect={onSelect}/>
        <Row title="Sci-Fi & Fantasy" shows={scifi} onSelect={onSelect}/>
        <Row title="Drama" shows={drama} onSelect={onSelect}/>
        <Row title="Comedy" shows={comedy} onSelect={onSelect}/>
        <Row title="Documentaries & Sports" shows={docs} onSelect={onSelect}/>
        {myListShows.length>0 && <Row title="❤️ My List" shows={myListShows} onSelect={onSelect}/>}
      </div>
      <div style={{ height:'24px' }} />
    </div>
  )
}

// ── Search ────────────────────────────────────────────────────────────────────
function SearchScreen({ onSelect }: { onSelect:(s:Show)=>void }) {
  const [q,setQ]=useState(''); const [genre,setGenre]=useState('All'); const [foc,setFoc]=useState(false)
  const results=byGenre(genre).filter(s=>!q||s.title.toLowerCase().includes(q.toLowerCase())||s.genres.some(g=>g.toLowerCase().includes(q.toLowerCase()))||s.cast.some(c=>c.toLowerCase().includes(q.toLowerCase()))||(s.country||'').toLowerCase().includes(q.toLowerCase()))
  const icons:Record<string,string>={All:'✦',Action:'💥',Crime:'🚔',Thriller:'🔍','Sci-Fi':'🚀',Fantasy:'⚔️',Horror:'👻',Drama:'🎭',Romance:'❤️',Comedy:'😂',Animation:'🎨',Documentary:'🎬',Sports:'🏆'}
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background:BG }}>
      <StatusBar/>
      <div className="px-4 pb-3">
        <h1 style={{ color:'white', fontSize:'24px', fontWeight:800, marginBottom:'14px' }}>Search</h1>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background:'#0F0F0F', border:`1.5px solid ${foc?RED:'#2a2a2a'}`, transition:'border-color 0.2s' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} placeholder="Titles, genres, cast, country…"
                 style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'white', fontSize:'15px', fontFamily:'Inter,sans-serif' }}/>
          {q && <button onClick={()=>setQ('')} style={{ color:'#555', fontSize:'16px', background:'transparent', border:'none', cursor:'pointer' }}>✕</button>}
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {ALL_GENRES.map(g=>(
          <button key={g} onClick={()=>setGenre(g)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background:genre===g?RED:SURFACE, color:genre===g?'white':'#888', border:`1px solid ${genre===g?RED:'#2a2a2a'}`, fontSize:'12px', fontWeight:genre===g?700:400, cursor:'pointer', transition:'all 0.15s' }}>
            <span>{icons[g]||'🎬'}</span><span>{g}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-24">
        {q||genre!=='All' ? (
          <>
            <p style={{ color:'#555', fontSize:'13px', marginBottom:'14px' }}>{results.length} result{results.length!==1?'s':''}{q&&` for "${q}"`}</p>
            {results.length>0
              ? <div className="grid grid-cols-3 gap-2.5">{results.map(s=><PCard key={s.id} show={s} onSelect={onSelect} w={108}/>)}</div>
              : <div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:'44px',marginBottom:'12px' }}>🔍</div><p style={{ color:'#555' }}>Nothing found</p></div>
            }
          </>
        ) : (
          <>
            <p style={{ color:'#3a3a3a', fontSize:'11px', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'14px' }}>Browse by Genre</p>
            <div className="grid grid-cols-2 gap-3">
              {ALL_GENRES.slice(1).map((g,i)=>{
                const cols=[RED,'#4A9DFF','#F5A623','#46d369','#7B68EE','#FF6B6B','#4ECDC4','#FFE66D','#C3A6FF','#FFA07A','#98D8C8','#FF9F43']
                return (
                  <button key={g} onClick={()=>setGenre(g)} className="p-4 rounded-xl flex flex-col items-start gap-1.5 text-left"
                          style={{ background:`${cols[i%cols.length]}18`, border:`1px solid ${cols[i%cols.length]}35`, cursor:'pointer' }}>
                    <span style={{ fontSize:'24px' }}>{icons[g]||'🎬'}</span>
                    <span style={{ color:'white', fontSize:'14px', fontWeight:700 }}>{g}</span>
                    <span style={{ color:'#555', fontSize:'11px' }}>{byGenre(g).length} titles</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── New & Hot ─────────────────────────────────────────────────────────────────
function NewHotScreen({ onSelect }: { onSelect:(s:Show)=>void }) {
  const [t,setT]=useState<'top10'|'new'|'coming'>('top10')
  const top10=SHOWS.filter(s=>s.top10).sort((a,b)=>(a.top10||99)-(b.top10||99))
  const newS=SHOWS.filter(s=>s.isNew||s.year>=2023)
  const coming=[
    { title:'Neon City', date:'Sep 6', genres:'Sci-Fi · Action', desc:'In a sprawling cyberpunk megacity, a data thief uncovers the conspiracy that built it all.' },
    { title:'The Edge', date:'Sep 20', genres:'Thriller · Drama', desc:'A hostage negotiator faces her most personal case — her own family.' },
    { title:'Starfall', date:'Oct 4', genres:'Sci-Fi · Romance', desc:'Two astronauts stranded in deep space discover what it truly means to be human.' },
  ]
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background:BG }}>
      <StatusBar/>
      <div className="px-4 pb-3">
        <h1 style={{ color:'white', fontSize:'24px', fontWeight:800, marginBottom:'16px' }}>New &amp; Hot 🔥</h1>
        <div className="flex gap-2">
          {([['top10','🏆 Top 10'],['new','✨ New'],['coming','🕐 Coming Soon']] as const).map(([id,lbl])=>(
            <button key={id} onClick={()=>setT(id)} className="px-3 py-1.5 rounded-full"
                    style={{ background:t===id?'white':SURFACE, color:t===id?'black':'#888', border:`1px solid ${t===id?'white':'#2a2a2a'}`, fontSize:'12px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>{lbl}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-24 space-y-4">
        {t==='top10' && top10.map(s=>(
          <button key={s.id} onClick={()=>onSelect(s)} className="w-full flex gap-3 rounded-xl overflow-hidden text-left active:opacity-80" style={{ background:SURFACE, border:'1px solid #2a2a2a', cursor:'pointer' }}>
            <div className="relative flex-shrink-0" style={{ width:'100px', height:'70px' }}>
              <Poster show={s} className="w-full h-full object-cover" style={{ display:'block' }}/>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:PF, color:'white', fontSize:'30px', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.9)', WebkitTextStroke:`2px ${RED}` }}>{s.top10}</span>
              </div>
            </div>
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p style={{ color:'white', fontSize:'14px', fontWeight:700 }}>{s.title}</p>
                <span style={{ fontSize:'9px', padding:'2px 6px', background:RED, color:'white', borderRadius:'4px', fontWeight:700, flexShrink:0 }}>#{s.top10}</span>
              </div>
              <p style={{ color:'#777', fontSize:'11px', lineHeight:1.4, marginTop:'3px' }} className="line-clamp-2">{s.description}</p>
            </div>
          </button>
        ))}
        {t==='new' && newS.map(s=>(
          <button key={s.id} onClick={()=>onSelect(s)} className="w-full text-left active:opacity-80" style={{ cursor:'pointer' }}>
            <div className="relative rounded-xl overflow-hidden" style={{ height:'190px' }}>
              <Poster show={s} className="w-full h-full object-cover" style={{ display:'block' }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 35%, rgba(20,20,20,0.95) 100%)' }}/>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span style={{ fontSize:'10px', color:RED, fontWeight:700, letterSpacing:'0.15em' }}>NEW {s.year>=2024?'2024':'2023'}</span>
                <h3 style={{ color:'white', fontSize:'18px', fontWeight:900, marginTop:'2px' }}>{s.title}</h3>
                <div className="flex gap-2 mt-1">{s.genres.slice(0,3).map(g=><span key={g} style={{ color:'#aaa', fontSize:'11px' }}>{g}</span>)}</div>
              </div>
            </div>
            <p style={{ color:'#777', fontSize:'12px', lineHeight:1.5, marginTop:'8px' }} className="line-clamp-2">{s.description}</p>
          </button>
        ))}
        {t==='coming' && coming.map(c=>(
          <div key={c.title} className="rounded-xl overflow-hidden" style={{ background:SURFACE, border:'1px solid #2a2a2a' }}>
            <div style={{ height:'130px', background:`linear-gradient(135deg, #1a1a1a, #0a0a0a)`, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'8px' }}>
              <span style={{ color:'white', fontSize:'40px', fontWeight:900, opacity:0.2 }}>?</span>
              <span style={{ color:'#2a2a2a', fontSize:'11px' }}>Preview not available</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span style={{ color:RED, fontSize:'11px', fontWeight:700 }}>Coming {c.date}</span>
                <button onClick={()=>toast(`Reminder set for ${c.title}`,'🔔')} style={{ color:RED, fontSize:'11px', fontWeight:600, background:'transparent', border:'none', cursor:'pointer' }}>🔔 Remind Me</button>
              </div>
              <h3 style={{ color:'white', fontSize:'17px', fontWeight:700 }}>{c.title}</h3>
              <p style={{ color:'#666', fontSize:'11px', marginTop:'2px', marginBottom:'8px' }}>{c.genres}</p>
              <p style={{ color:'#777', fontSize:'12px', lineHeight:1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── My AIRA ───────────────────────────────────────────────────────────────────
function MyAIRAScreen({ onSelect, myList, downloads, onDeleteDownload, onSignOut, userPlan, onSubscribe }:
  { onSelect:(s:Show)=>void; myList:number[]; downloads:number[]; onDeleteDownload:(id:number)=>void; onSignOut:()=>void; userPlan:Plan; onSubscribe:()=>void }) {
  const [sec,setSec]=useState<'list'|'dl'|'history'|'settings'>('list')
  const myShows=SHOWS.filter(s=>myList.includes(s.id))
  const dlShows=SHOWS.filter(s=>downloads.includes(s.id))
  const histShows=SHOWS.filter(s=>s.progress!=null||s.top10!=null).slice(0,8)
  const planObj=PLANS.find(p=>p.id===userPlan)!
  const [dlQuality,setDlQuality]=useState('HD')
  const [lang,setLang]=useState('EN')
  const settings=[
    {icon:'📱',label:'Manage Devices',     action:()=>toast('2 of 2 devices active — tap to manage','📱')},
    {icon:'🔔',label:'Notifications',      action:()=>toast('Notification preferences saved','🔔')},
    {icon:'🔒',label:'Parental Controls',  action:()=>toast('Kids mode: ON — PIN required to change','🔒')},
    {icon:'💳',label:'Billing & Invoices', action:()=>toast('Invoice sent to user@email.com','💳')},
    {icon:'🎫',label:'Redeem Coupon Code', action:()=>toast('Enter code at checkout — try AIRA20','🎫')},
    {icon:'📊',label:'Analytics & History',action:()=>toast('248 hours watched this year 🎉','📊')},
    {icon:'❓',label:'Help & Support',     action:()=>toast('Support chat opened — avg wait 2 min','❓')},
  ]
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background:BG }}>
      <StatusBar/>
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background:SURFACE, border:'1px solid #2a2a2a' }}>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background:`${RED}20`, border:`2px solid ${RED}50` }}>🎬</div>
          <div className="flex-1">
            <p style={{ color:'white', fontSize:'16px', fontWeight:700 }}>You</p>
            <p style={{ color:'#555', fontSize:'12px' }}>user@email.com</p>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'4px', background:planObj.color, color:'white', fontWeight:700 }}>{planObj.name.toUpperCase()}</span>
              <span style={{ color:'#333', fontSize:'11px' }}>· Active</span>
            </div>
          </div>
          <button onClick={onSubscribe} style={{ padding:'7px 12px', background:`${RED}15`, color:RED, fontWeight:700, fontSize:'11px', borderRadius:'8px', border:`1px solid ${RED}40`, cursor:'pointer' }}>Upgrade</button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-b px-4" style={{ borderColor:'#222', gap:'2px' }}>
        {([['list','My List'],['dl','Downloads'],['history','History'],['settings','Settings']] as const).map(([id,lbl])=>(
          <button key={id} onClick={()=>setSec(id)}
                  style={{ padding:'8px 11px', fontSize:'12px', fontWeight:500, color:sec===id?'white':'#444', borderTop:'none', borderLeft:'none', borderRight:'none', borderBottom:`2px solid ${sec===id?RED:'transparent'}`, marginBottom:'-1px', background:'transparent', cursor:'pointer', whiteSpace:'nowrap' }}>
            {lbl}{id==='list'&&myShows.length>0?` (${myShows.length})`:''}{id==='dl'&&dlShows.length>0?` (${dlShows.length})`:''}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-24 pt-3">
        {sec==='list' && (
          myShows.length>0
            ? <div className="grid grid-cols-3 gap-2.5">{myShows.map(s=><PCard key={s.id} show={s} onSelect={onSelect} w={108}/>)}</div>
            : <div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:'44px',marginBottom:'12px' }}>❤️</div><p style={{ color:'#555' }}>Your list is empty</p><p style={{ color:'#333', fontSize:'12px', marginTop:'4px' }}>Tap + on any title to add it</p></div>
        )}
        {sec==='dl' && (
          <>
            {/* Download quality */}
            <div className="p-4 rounded-xl mb-4" style={{ background:SURFACE, border:'1px solid #2a2a2a' }}>
              <p style={{ color:'white', fontSize:'13px', fontWeight:600, marginBottom:'10px' }}>Download Quality</p>
              <div className="flex gap-2">
                {['SD','HD','Full HD','4K'].map(q=>(
                  <button key={q} onClick={()=>setDlQuality(q)} style={{ flex:1, padding:'8px 4px', borderRadius:'7px', background:dlQuality===q?RED:CARD, color:dlQuality===q?'white':'#666', border:`1px solid ${dlQuality===q?RED:'#333'}`, fontSize:'11px', fontWeight:700, cursor:'pointer' }}>{q}</button>
                ))}
              </div>
            </div>
            {dlShows.length>0
              ? <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background:SURFACE }}>
                    <div className="flex justify-between mb-1.5"><span style={{ color:'white', fontSize:'12px', fontWeight:500 }}>Storage</span><span style={{ color:'#555', fontSize:'12px' }}>{(dlShows.length*1.2).toFixed(1)}GB / 15GB</span></div>
                    <div style={{ height:'4px', background:'#1a1a1a', borderRadius:'2px' }}><div style={{ width:`${Math.min(99,dlShows.length*14)}%`, height:'100%', background:RED, borderRadius:'2px' }}/></div>
                  </div>
                  {dlShows.map(s=>(
                    <div key={s.id} className="flex gap-3 rounded-xl p-3" style={{ background:SURFACE }}>
                      <div className="relative rounded-lg overflow-hidden flex-shrink-0" style={{ width:'72px', height:'48px' }}>
                        <Poster show={s} className="w-full h-full object-cover" style={{ display:'block' }}/>
                        <button onClick={()=>onSelect(s)} style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', cursor:'pointer' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ color:'white', fontSize:'13px', fontWeight:600 }} className="truncate">{s.title}</p>
                        <p style={{ color:'#555', fontSize:'11px', marginTop:'2px' }}>{dlQuality} · ~{dlQuality==='4K'?'3.8':dlQuality==='Full HD'?'2.1':dlQuality==='HD'?'1.2':'0.6'} GB</p>
                        <p style={{ color:'#3a3a3a', fontSize:'10px' }}>Expires in 28 days</p>
                      </div>
                      <button onClick={()=>onDeleteDownload(s.id)} style={{ color:'#444', background:'transparent', border:'none', cursor:'pointer', padding:'4px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              : <div style={{ textAlign:'center', padding:'40px 0' }}><div style={{ fontSize:'44px',marginBottom:'12px' }}>📥</div><p style={{ color:'#555' }}>No downloads yet</p><p style={{ color:'#333', fontSize:'12px', marginTop:'4px' }}>Tap ↓ on any title to save offline</p></div>
            }
          </>
        )}
        {sec==='history' && (
          <>
            <p style={{ color:'#444', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>Watch History</p>
            <div className="space-y-3">
              {histShows.map((s,i)=>(
                <button key={s.id} onClick={()=>onSelect(s)} className="w-full flex gap-3 items-center active:opacity-80" style={{ background:'transparent', border:'none', cursor:'pointer' }}>
                  <div className="relative rounded-lg overflow-hidden flex-shrink-0" style={{ width:'64px', height:'42px' }}>
                    <Poster show={s} className="w-full h-full object-cover" style={{ display:'block' }}/>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p style={{ color:'white', fontSize:'13px', fontWeight:600 }} className="truncate">{s.title}</p>
                    <p style={{ color:'#555', fontSize:'11px' }}>{i<3?'Today':i<6?'Yesterday':'This week'}</p>
                    {s.progress && <div style={{ height:'2px', background:'#2a2a2a', borderRadius:'1px', marginTop:'4px' }}><div style={{ width:`${s.progress}%`, height:'100%', background:RED, borderRadius:'1px' }}/></div>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
            <button onClick={()=>toast('Watch history cleared','🗑️')} style={{ marginTop:'16px', color:'#444', fontSize:'12px', background:'transparent', border:'none', cursor:'pointer', display:'block', width:'100%', textAlign:'center' }}>Clear History</button>
          </>
        )}
        {sec==='settings' && (
          <>
            {/* Language */}
            <div className="p-4 rounded-xl mb-4" style={{ background:SURFACE, border:'1px solid #2a2a2a' }}>
              <p style={{ color:'white', fontSize:'13px', fontWeight:600, marginBottom:'10px' }}>Language & Subtitles</p>
              <div className="flex gap-2 flex-wrap">
                {LANGS.map(l=>(
                  <button key={l.code} onClick={()=>setLang(l.code)} style={{ padding:'7px 12px', borderRadius:'7px', background:lang===l.code?RED:CARD, color:lang===l.code?'white':'#666', border:`1px solid ${lang===l.code?RED:'#333'}`, fontSize:'12px', fontWeight:600, cursor:'pointer' }}>{l.code}</button>
                ))}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden mb-4" style={{ border:'1px solid #1e1e1e' }}>
              {settings.map((s,i)=>(
                <button key={s.label} onClick={s.action} className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70"
                        style={{ background:i%2===0?SURFACE:CARD, borderBottom:i<settings.length-1?'1px solid #1e1e1e':'none', cursor:'pointer', border:'none' }}>
                  <div className="flex items-center gap-3"><span style={{ fontSize:'16px', width:'20px', textAlign:'center' }}>{s.icon}</span><span style={{ color:'white', fontSize:'14px' }}>{s.label}</span></div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a3a3a" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
            <button onClick={onSignOut} style={{ width:'100%', padding:'15px', background:'transparent', color:'#dc2626', border:'1px solid #dc262633', borderRadius:'10px', fontSize:'15px', fontWeight:600, cursor:'pointer' }}>Sign Out</button>
            <p style={{ color:'#222', fontSize:'11px', textAlign:'center', marginTop:'16px' }}>AIRA by Hanedan · v2.0.0 · © 2025</p>
          </>
        )}
      </div>
    </div>
  )
}

// ── Detail ────────────────────────────────────────────────────────────────────
function DetailScreen({ show, onBack, onPlay, myList, onToggle, likes, dislikes, onLike, onDislike, downloads, onDownload, userPlan, onSubscribe }:
  { show:Show; onBack:()=>void; onPlay:(s:Show)=>void; myList:number[]; onToggle:(id:number)=>void; likes:number[]; dislikes:number[]; onLike:(id:number)=>void; onDislike:(id:number)=>void; downloads:number[]; onDownload:(id:number)=>void; userPlan:Plan; onSubscribe:()=>void }) {
  const [tab,setTab]=useState<'eps'|'more'>('eps')
  const [shareOpen,setShareOpen]=useState(false)
  const inList=myList.includes(show.id); const liked=likes.includes(show.id); const disliked=dislikes.includes(show.id); const inDl=downloads.includes(show.id)
  const locked=show.premium&&userPlan!=='premium'
  const similar=SHOWS.filter(s=>s.id!==show.id&&s.genres.some(g=>show.genres.includes(g))).slice(0,6)

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-hide" style={{ background:BG, zIndex:50 }}>
      <div className="relative" style={{ height:'290px' }}>
        <Poster show={show} className="w-full h-full object-cover" style={{ display:'block', position:'absolute', inset:0 }}/>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(20,20,20,0.25) 0%, transparent 25%, rgba(20,20,20,0.85) 70%, #141414 100%)' }}/>
        <button onClick={onBack} className="absolute flex items-center justify-center w-10 h-10 rounded-full"
                style={{ top:'56px', left:'16px', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.12)', zIndex:60, cursor:'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="absolute flex items-center gap-2" style={{ top:'54px', right:'16px' }}>
          {show.premium && <span style={{ fontSize:'9px', padding:'3px 8px', background:'#F5A623', color:'black', borderRadius:'4px', fontWeight:700 }}>PREMIUM</span>}
          {show.isNew && <span style={{ fontSize:'9px', padding:'3px 8px', background:RED, color:'white', borderRadius:'4px', fontWeight:700 }}>NEW</span>}
          {show.top10 && <span style={{ fontSize:'9px', padding:'3px 8px', background:'rgba(255,255,255,0.2)', color:'white', borderRadius:'4px', fontWeight:700 }}>#{show.top10}</span>}
        </div>
      </div>

      <div className="px-4 pb-10">
        <h1 style={{ color:'white', fontSize:'24px', fontWeight:900, lineHeight:1.15, marginBottom:'8px', letterSpacing:'-0.01em' }}>{show.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span style={{ color:'#46d369', fontSize:'13px', fontWeight:700 }}>{matchPct(show)}% Match</span>
          <span style={{ color:'#aaa', fontSize:'12px' }}>{show.year}</span>
          <span style={{ border:'1px solid #aaa', color:'#aaa', fontSize:'10px', padding:'1px 5px', borderRadius:'3px' }}>{show.maturity}</span>
          {show.seasons && <span style={{ color:'#aaa', fontSize:'12px' }}>{show.seasons} Seasons</span>}
          {show.dur && <span style={{ color:'#aaa', fontSize:'12px' }}>{show.dur}</span>}
          {show.imdb && <span style={{ background:'#333', color:'#ddd', fontSize:'10px', padding:'1px 6px', borderRadius:'3px', fontWeight:600 }}>⭐ {show.imdb}</span>}
          {show.country && <span style={{ background:'#333', color:'#ddd', fontSize:'10px', padding:'1px 6px', borderRadius:'3px' }}>{show.country}</span>}
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {show.genres.map(g=><span key={g} style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'99px', background:CARD, color:'#aaa', border:'1px solid #2a2a2a' }}>{g}</span>)}
        </div>
        <p style={{ color:'#ccc', fontSize:'13px', lineHeight:1.65, marginBottom:'16px' }}>{show.description}</p>
        <p style={{ color:'#555', fontSize:'12px', marginBottom:'20px' }}><span style={{ color:'#aaa' }}>Cast: </span>{show.cast.join(' · ')}</p>

        {locked ? (
          <div className="p-5 rounded-xl mb-5" style={{ background:`${RED}12`, border:`1px solid ${RED}40` }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize:'24px' }}>🔒</span>
              <div><p style={{ color:'white', fontWeight:700, fontSize:'15px' }}>Premium Content</p><p style={{ color:'#666', fontSize:'12px' }}>Upgrade to Premium to watch</p></div>
            </div>
            <button onClick={onSubscribe} style={{ width:'100%', padding:'13px', background:RED, color:'white', fontWeight:700, fontSize:'15px', borderRadius:'8px', border:'none', cursor:'pointer' }}>Upgrade to Premium</button>
          </div>
        ) : (
          <div className="flex gap-3 mb-4">
            <button onClick={()=>onPlay(show)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'13px', background:'white', color:'black', fontWeight:800, fontSize:'15px', borderRadius:'8px', border:'none', cursor:'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="black" style={{ marginLeft:'1px' }}><polygon points="5 3 19 12 5 21 5 3"/></svg>Play
            </button>
            <button onClick={()=>onDownload(show.id)} style={{ width:'50px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px', background:inDl?`${RED}20`:CARD, border:`1px solid ${inDl?RED:'#2a2a2a'}`, color:inDl?RED:'#888', cursor:'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {inDl ? <polyline points="20 6 9 17 4 12"/> : <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>}
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-around py-3 rounded-xl mb-5" style={{ background:SURFACE }}>
          {[
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill={inList?RED:'none'} stroke={inList?RED:'#888'} strokeWidth="1.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>, label:'My List', action:()=>onToggle(show.id) },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill={liked?'#46d369':'none'} stroke={liked?'#46d369':'#888'} strokeWidth="1.8" strokeLinecap="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>, label:'Like', action:()=>onLike(show.id) },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill={disliked?'#dc2626':'none'} stroke={disliked?'#dc2626':'#888'} strokeWidth="1.8" strokeLinecap="round"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>, label:'Dislike', action:()=>onDislike(show.id) },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>, label:'Share', action:()=>setShareOpen(true) },
          ].map(({icon,label,action})=>(
            <button key={label} onClick={action} className="flex flex-col items-center gap-1" style={{ background:'transparent', border:'none', cursor:'pointer' }}>
              {icon}<span style={{ color:'#666', fontSize:'10px' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Share sheet */}
        {shareOpen && (
          <div className="fixed inset-0 z-50 flex items-end" style={{ background:'rgba(0,0,0,0.5)' }} onClick={()=>setShareOpen(false)}>
            <div className="w-full rounded-t-2xl p-5 animate-fade-up" style={{ background:'#111', border:'1px solid #2a2a2a' }} onClick={e=>e.stopPropagation()}>
              <div style={{ width:'40px', height:'4px', background:'#333', borderRadius:'2px', margin:'0 auto 16px' }}/>
              <p style={{ color:'white', fontSize:'15px', fontWeight:700, marginBottom:'4px' }}>Share "{show.title}"</p>
              <p style={{ color:'#555', fontSize:'12px', marginBottom:'16px' }}>Share this title with friends</p>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[['📱','Messages'],['📧','Email'],['🟢','WhatsApp'],['🔵','Facebook'],['🐦','Twitter'],['📋','Copy Link'],['💬','Telegram'],['📤','More']].map(([ic,lbl])=>(
                  <button key={lbl} onClick={()=>{ toast(`Shared via ${lbl}`, ic as string); setShareOpen(false) }}
                          className="flex flex-col items-center gap-2 p-2 rounded-xl"
                          style={{ background:SURFACE, border:'1px solid #2a2a2a', cursor:'pointer' }}>
                    <span style={{ fontSize:'22px' }}>{ic}</span>
                    <span style={{ color:'#aaa', fontSize:'9px', fontWeight:500 }}>{lbl}</span>
                  </button>
                ))}
              </div>
              <button onClick={()=>setShareOpen(false)} style={{ width:'100%', padding:'14px', background:CARD, color:'white', border:'none', borderRadius:'10px', fontSize:'15px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="flex mb-4" style={{ borderBottom:'1px solid #1e1e1e' }}>
          {(['eps','more'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 16px', fontSize:'13px', fontWeight:500, color:tab===t?'white':'#444', borderTop:'none', borderLeft:'none', borderRight:'none', borderBottom:`2px solid ${tab===t?RED:'transparent'}`, marginBottom:'-1px', background:'transparent', cursor:'pointer' }}>
              {t==='eps'?'Episodes':'More Like This'}
            </button>
          ))}
        </div>

        {tab==='eps' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span style={{ color:'#666', fontSize:'13px' }}>Season 1</span>
              <button style={{ color:RED, fontSize:'12px', display:'flex', alignItems:'center', gap:'4px', background:'transparent', border:'none', cursor:'pointer' }}>All Seasons <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
            </div>
            {EPISODES.map(ep=>(
              <button key={ep.num} onClick={()=>onPlay(show)} className="w-full flex gap-3 rounded-xl p-2.5 text-left" style={{ background:ep.current?`${RED}12`:CARD, border:`1px solid ${ep.current?RED+'44':'#1e1e1e'}`, cursor:'pointer' }}>
                <div className="relative rounded-lg overflow-hidden flex-shrink-0" style={{ width:'96px', height:'60px', background:'#111' }}>
                  <Poster show={show} className="w-full h-full object-cover" style={{ display:'block' }}/>
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {ep.watched ? <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#46d369" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
                    : <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="white" style={{ marginLeft:'1px' }}><polygon points="5 3 19 12 5 21 5 3"/></svg></div>}
                  </div>
                  {ep.current && <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'rgba(255,255,255,0.1)' }}><div style={{ width:'45%', height:'100%', background:RED }}/></div>}
                </div>
                <div className="flex-1 pt-0.5">
                  <p style={{ color:ep.current?RED:'white', fontSize:'13px', fontWeight:600 }}>{ep.num}. {ep.title}</p>
                  <p style={{ color:'#555', fontSize:'11px', marginTop:'2px' }}>{ep.dur}</p>
                  {ep.current && <p style={{ color:RED, fontSize:'10px', marginTop:'3px' }}>● Watching</p>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">{similar.map(s=><PCard key={s.id} show={s} onSelect={onPlay} w={108}/>)}</div>
        )}
      </div>
    </div>
  )
}

// ── Player ────────────────────────────────────────────────────────────────────
function PlayerScreen({ show, onBack }: { show:Show; onBack:()=>void }) {
  const [playing,setPlaying]=useState(true)
  const [prog,setProg]=useState(show.progress??12)
  const [vis,setVis]=useState(true)
  const [skipIntro,setSkipIntro]=useState(true)
  const [skipCredits,setSkipCredits]=useState(true)
  const [subMenu,setSubMenu]=useState(false)
  const [langMenu,setLangMenu]=useState(false)
  const [speedMenu,setSpeedMenu]=useState(false)
  const [qualMenu,setQualMenu]=useState(false)
  const [castMenu,setCastMenu]=useState(false)
  const [qual,setQual]=useState('4K HDR')
  const [speed,setSpeed]=useState('1×')
  const [subLang,setSubLang]=useState('EN')
  const [autoPlay,setAutoPlay]=useState(true)
  const [nextEpCt,setNextEpCt]=useState<number|null>(null)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)

  const resetTimer=()=>{ if(timer.current)clearTimeout(timer.current); timer.current=setTimeout(()=>setVis(false),3500) }
  useEffect(()=>{ resetTimer(); return()=>{ if(timer.current)clearTimeout(timer.current) } },[])
  useEffect(()=>{
    if(!playing)return
    const id=setInterval(()=>setProg(p=>{
      if(p>=99){ if(autoPlay&&show.seasons){setNextEpCt(5)} return 100 }
      return Math.min(p+0.04,100)
    }),100)
    return()=>clearInterval(id)
  },[playing,autoPlay,show.seasons])
  useEffect(()=>{
    if(nextEpCt===null)return
    if(nextEpCt===0){setNextEpCt(null);setProg(0);return}
    const id=setTimeout(()=>setNextEpCt(c=>c!==null?c-1:null),1000)
    return()=>clearTimeout(id)
  },[nextEpCt])

  const elapsed=Math.floor((prog/100)*parseInt(show.dur||'52')*60)
  const total=parseInt(show.dur||'52')*60
  const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const tap=()=>{ setVis(true); resetTimer() }

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background:'#000', zIndex:100 }} onClick={tap}>
      <div className="absolute inset-0">
        <Poster show={show} className="w-full h-full object-cover" style={{ display:'block', opacity:0.3, filter:'blur(2px)' }}/>
        <div className="absolute inset-0" style={{ background:'rgba(0,0,0,0.6)' }}/>
      </div>
      {/* DRM Watermark */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.04, pointerEvents:'none', fontFamily:PF, color:'white', fontSize:'34px', fontWeight:700, letterSpacing:'0.2em', userSelect:'none', rotate:'-15deg' }}>AIRA PROTECTED</div>

      {/* Back button — always visible top-left, never fades */}
      <button onClick={e=>{e.stopPropagation();onBack()}}
              className="absolute flex items-center justify-center w-10 h-10 rounded-full"
              style={{ top:'56px', left:'16px', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.12)', zIndex:120, cursor:'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div className="absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300" style={{ opacity:vis?1:0, paddingTop:'52px', pointerEvents:vis?'auto':'none' }}>
        {/* Top — back replaced by spacer, title centre, more-menu right */}
        <div className="flex items-center justify-between">
          <div style={{ width:'40px' }} />
          <div style={{ textAlign:'center' }}>
            <p style={{ color:'white', fontFamily:PF, fontSize:'15px', fontWeight:700 }}>{show.title}</p>
            <p style={{ color:'#777', fontSize:'11px' }}>S1:E3 · Shadow Protocol</p>
          </div>
          <button onClick={e=>{e.stopPropagation();setSubMenu(v=>!v)}} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background:'rgba(0,0,0,0.55)', border:'none', cursor:'pointer' }}>
            <svg width="4" height="18" viewBox="0 0 4 20" fill="white"><circle cx="2" cy="2" r="2"/><circle cx="2" cy="10" r="2"/><circle cx="2" cy="18" r="2"/></svg>
          </button>
        </div>

        {/* Center */}
        <div className="flex items-center justify-center gap-10">
          <button onClick={e=>{e.stopPropagation();setProg(p=>Math.max(0,p-4))}} style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.8)' }}>
            <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.3"/><text x="22" y="26" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700">10</text><path d="M16 19h8m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>
          </button>
          <button onClick={e=>{e.stopPropagation();setPlaying(v=>!v)}} style={{ width:'68px', height:'68px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'2px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            {playing ? <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ marginLeft:'3px' }}><polygon points="5 3 19 12 5 21 5 3"/></svg>}
          </button>
          <button onClick={e=>{e.stopPropagation();setProg(p=>Math.min(100,p+4))}} style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.8)' }}>
            <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.3"/><text x="22" y="26" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700">10</text><path d="M28 19h-8m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>
          </button>
        </div>

        {/* Bottom */}
        <div>
          {/* Next episode auto-play */}
          {nextEpCt!==null && (
            <div className="flex items-center justify-between mb-3 p-3 rounded-xl" style={{ background:'rgba(0,0,0,0.75)', border:'1px solid #2a2a2a' }} onClick={e=>e.stopPropagation()}>
              <div><p style={{ color:'white', fontSize:'12px', fontWeight:700 }}>Next Episode</p><p style={{ color:'#888', fontSize:'11px' }}>Playing in {nextEpCt}s…</p></div>
              <div className="flex gap-2">
                <button onClick={()=>setNextEpCt(null)} style={{ padding:'6px 12px', background:CARD, color:'white', border:'1px solid #333', borderRadius:'6px', fontSize:'12px', cursor:'pointer' }}>Cancel</button>
                <button onClick={()=>{setNextEpCt(null);setProg(0)}} style={{ padding:'6px 12px', background:RED, color:'white', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>Play Now</button>
              </div>
            </div>
          )}
          {/* Skip Intro */}
          {skipIntro && prog<20 && (
            <div className="flex justify-end mb-3">
              <button onClick={e=>{e.stopPropagation();setSkipIntro(false)}} style={{ padding:'9px 18px', background:'rgba(0,0,0,0.8)', color:'white', border:'1.5px solid white', borderRadius:'6px', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>Skip Intro ⏭</button>
            </div>
          )}
          {/* Skip Credits */}
          {skipCredits && prog>90 && (
            <div className="flex justify-end mb-3">
              <button onClick={e=>{e.stopPropagation();setSkipCredits(false);setProg(0)}} style={{ padding:'9px 18px', background:'rgba(0,0,0,0.8)', color:'white', border:'1.5px solid white', borderRadius:'6px', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>Skip Credits ⏭</button>
            </div>
          )}
          {/* Progress */}
          <input type="range" min="0" max="100" value={Math.round(prog)} onChange={e=>setProg(Number(e.target.value))} onClick={e=>e.stopPropagation()} className="w-full mb-1" style={{ accentColor:RED }}/>
          <div className="flex justify-between mb-3">
            <span style={{ color:'#aaa', fontSize:'11px' }}>{fmt(elapsed)}</span>
            <span style={{ color:'#aaa', fontSize:'11px' }}>-{fmt(total-elapsed)}</span>
          </div>
          {/* Bottom row icons */}
          <div className="flex items-center justify-between px-1">
            <button onClick={e=>{e.stopPropagation();setLangMenu(v=>!v);setSpeedMenu(false);setQualMenu(false);setCastMenu(false)}} style={{ background:'transparent', border:'none', cursor:'pointer' }}>
              <div style={{ fontSize:'10px', fontWeight:700, color:langMenu?RED:'#aaa', border:`1px solid ${langMenu?RED:'#555'}`, padding:'2px 6px', borderRadius:'4px' }}>SUB {subLang}</div>
            </button>
            <button onClick={e=>{e.stopPropagation();setSpeedMenu(v=>!v);setLangMenu(false);setQualMenu(false);setCastMenu(false)}} style={{ background:'transparent', border:'none', cursor:'pointer' }}>
              <div style={{ fontSize:'10px', fontWeight:700, color:speedMenu?RED:'#aaa', border:`1px solid ${speedMenu?RED:'#555'}`, padding:'2px 6px', borderRadius:'4px' }}>{speed}</div>
            </button>
            <button onClick={e=>{e.stopPropagation();setAutoPlay(v=>!v)}} style={{ background:'transparent', border:'none', cursor:'pointer' }}>
              <div style={{ fontSize:'9px', fontWeight:700, color:autoPlay?RED:'#555', border:`1px solid ${autoPlay?RED:'#444'}`, padding:'2px 6px', borderRadius:'4px' }}>AUTO</div>
            </button>
            <button onClick={e=>{e.stopPropagation();setQualMenu(v=>!v);setLangMenu(false);setSpeedMenu(false);setCastMenu(false)}} style={{ background:'transparent', border:'none', cursor:'pointer', color:qualMenu?RED:'#999' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </button>
            <button onClick={e=>{e.stopPropagation();setCastMenu(v=>!v);setLangMenu(false);setSpeedMenu(false);setQualMenu(false)}} style={{ background:'transparent', border:'none', cursor:'pointer', color:castMenu?RED:'#999' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 8.82a15 15 0 0120.17 0M5 12.65a10 10 0 0114 0M8 16.7a5 5 0 018 0M12 21h.01"/></svg>
            </button>
            <button onClick={e=>{e.stopPropagation();setNextEpCt(5);setPlaying(false)}} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#999' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><rect x="19" y="4" width="2" height="16" rx="1"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Subtitle language picker */}
      {langMenu && (
        <div className="absolute rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}
             style={{ left:'16px', bottom:'120px', background:'#1a1a1a', border:'1px solid #2a2a2a', zIndex:210, minWidth:'160px' }}>
          <p style={{ color:'#555', fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 16px 6px' }}>Subtitles</p>
          {[{code:'Off',label:'Off'},...LANGS].map(l=>(
            <button key={l.code} onClick={()=>{setSubLang(l.code);setLangMenu(false)}} className="block w-full text-left px-4 py-2.5"
                    style={{ color:subLang===l.code?RED:'white', background:'transparent', border:'none', cursor:'pointer', fontSize:'13px', borderBottom:'1px solid #222' }}>
              {subLang===l.code?'✓ ':''}{l.label}
            </button>
          ))}
        </div>
      )}

      {/* Speed picker */}
      {speedMenu && (
        <div className="absolute rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}
             style={{ left:'50%', bottom:'120px', transform:'translateX(-50%)', background:'#1a1a1a', border:'1px solid #2a2a2a', zIndex:210, minWidth:'140px' }}>
          <p style={{ color:'#555', fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 16px 6px' }}>Playback Speed</p>
          {SPEEDS.map(s=>(
            <button key={s} onClick={()=>{setSpeed(s);setSpeedMenu(false)}} className="block w-full text-left px-4 py-2.5"
                    style={{ color:speed===s?RED:'white', background:'transparent', border:'none', cursor:'pointer', fontSize:'13px', borderBottom:'1px solid #222' }}>
              {speed===s?'✓ ':''}{s}
            </button>
          ))}
        </div>
      )}

      {/* Quality picker */}
      {qualMenu && (
        <div className="absolute rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}
             style={{ right:'50px', bottom:'115px', background:'#1a1a1a', border:'1px solid #2a2a2a', zIndex:210, minWidth:'160px' }}>
          <p style={{ color:'#555', fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 16px 6px' }}>Video Quality</p>
          {['Auto','720p HD','1080p FHD','4K HDR','4K Dolby Vision'].map(q=>(
            <button key={q} onClick={()=>{setQual(q);setQualMenu(false)}} className="block w-full text-left px-4 py-2.5"
                    style={{ color:qual===q?RED:'white', background:'transparent', border:'none', cursor:'pointer', fontSize:'13px', borderBottom:'1px solid #222' }}>
              {qual===q?'✓ ':''}{q}
            </button>
          ))}
        </div>
      )}

      {/* Cast picker */}
      {castMenu && (
        <div className="absolute rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}
             style={{ right:'16px', bottom:'115px', background:'#1a1a1a', border:'1px solid #2a2a2a', zIndex:210, minWidth:'200px' }}>
          <p style={{ color:'#555', fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', padding:'10px 16px 6px' }}>Cast to Device</p>
          {[{icon:'📺',name:"Living Room TV"},{icon:'🖥',name:"Bedroom Display"},{icon:'💻',name:"MacBook Pro"},{icon:'📱',name:"This Device"}].map((d,i)=>(
            <button key={d.name} onClick={()=>{toast(`Casting to ${d.name}`,'📺');setCastMenu(false)}} className="flex items-center gap-3 w-full text-left px-4 py-3"
                    style={{ color:'white', background:'transparent', border:'none', cursor:'pointer', fontSize:'13px', borderBottom:i<3?'1px solid #222':'none' }}>
              <span style={{ fontSize:'16px' }}>{d.icon}</span>{d.name}
            </button>
          ))}
        </div>
      )}

      {/* More menu */}
      {subMenu && (
        <div className="absolute rounded-2xl overflow-hidden" onClick={e=>e.stopPropagation()}
             style={{ right:'16px', top:'92px', background:'#1a1a1a', border:'1px solid #2a2a2a', zIndex:210, minWidth:'200px' }}>
          {[
            {label:'Audio & Subtitles', action:()=>setLangMenu(true)},
            {label:`Video Quality (${qual})`, action:()=>setQualMenu(true)},
            {label:'Picture in Picture', action:()=>toast('Picture in Picture enabled','📱')},
            {label:'Lock Screen', action:()=>toast('Screen locked — tap to unlock','🔒')},
            {label:'Report Problem', action:()=>toast('Problem reported — thank you','🐛')},
            {label:'Cast to TV', action:()=>setCastMenu(true)},
          ].map((item,i)=>(
            <button key={item.label} onClick={()=>{item.action();setSubMenu(false)}} className="block w-full text-left px-4 py-3"
                    style={{ color:'white', borderBottom:i<5?'1px solid #222':'none', background:'transparent', cursor:'pointer', fontSize:'13px' }}>{item.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Subscribe ─────────────────────────────────────────────────────────────────
function SubscribeScreen({ onBack, onNext, selected, onSelect, currentPlan }:
  { onBack:()=>void; onNext:()=>void; selected:Plan; onSelect:(p:Plan)=>void; currentPlan:Plan }) {
  const [yearly,setYearly]=useState(false)
  return (
    <div className="h-full flex flex-col" style={{ background:BG }}>
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <button onClick={onBack} style={{ color:'white', background:'transparent', border:'none', cursor:'pointer', fontSize:'18px' }}>✕</button>
        <div style={{ fontFamily:PF, color:RED, fontSize:'20px', fontWeight:700, letterSpacing:'0.1em' }}>AIRA</div>
        <div style={{ width:'24px' }}/>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-8">
        <h2 style={{ color:'white', fontSize:'22px', fontWeight:800, marginBottom:'4px' }}>Choose Your Plan</h2>
        <p style={{ color:'#555', fontSize:'13px', marginBottom:'20px' }}>Downgrade, upgrade or cancel anytime.</p>
        <div className="flex items-center justify-center gap-3 mb-5 p-3 rounded-xl" style={{ background:SURFACE }}>
          <span style={{ color:!yearly?'white':'#555', fontSize:'13px', fontWeight:600 }}>Monthly</span>
          <button onClick={()=>setYearly(v=>!v)} style={{ width:'48px', height:'24px', borderRadius:'12px', background:yearly?RED:'#333', border:'none', cursor:'pointer', padding:0, position:'relative' }}>
            <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'white', position:'absolute', top:'2px', left:yearly?'26px':'2px', transition:'left 0.2s' }}/>
          </button>
          <div className="flex items-center gap-1.5">
            <span style={{ color:yearly?'white':'#555', fontSize:'13px', fontWeight:600 }}>Yearly</span>
            <span style={{ fontSize:'9px', padding:'2px 6px', background:'#46d369', color:'black', borderRadius:'4px', fontWeight:700 }}>SAVE 20%</span>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          {PLANS.map(plan=>{
            const price=yearly?plan.yearPrice:plan.price
            const isCur=plan.id===currentPlan; const isSel=plan.id===selected
            return (
              <button key={plan.id} onClick={()=>onSelect(plan.id)} className="w-full p-4 rounded-xl text-left"
                      style={{ background:isSel?`${plan.color}18`:SURFACE, border:`2px solid ${isSel?plan.color:'#2a2a2a'}`, cursor:'pointer', transition:'all 0.15s' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 style={{ color:isSel?plan.color:'white', fontSize:'18px', fontWeight:800 }}>{plan.name}</h3>
                      {isCur && <span style={{ fontSize:'9px', padding:'2px 6px', background:'#333', color:'#aaa', borderRadius:'4px', fontWeight:700 }}>CURRENT</span>}
                      {plan.badge && <span style={{ fontSize:'9px', padding:'2px 6px', background:plan.color, color:'white', borderRadius:'4px', fontWeight:700 }}>{plan.badge}</span>}
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span style={{ color:isSel?plan.color:'white', fontSize:'26px', fontWeight:900 }}>${price.toFixed(2)}</span>
                      <span style={{ color:'#555', fontSize:'12px' }}>/month{yearly?' (billed yearly)':''}</span>
                    </div>
                  </div>
                  <div style={{ width:'24px', height:'24px', borderRadius:'50%', border:`2px solid ${isSel?plan.color:'#444'}`, background:isSel?plan.color:'transparent', display:'flex', alignItems:'center', justifyContent:'center', marginTop:'4px' }}>
                    {isSel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {plan.features.map(f=>(
                    <div key={f} className="flex items-center gap-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isSel?plan.color:'#444'} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ color:isSel?'#ccc':'#666', fontSize:'11px' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
        <button onClick={onNext} style={{ width:'100%', padding:'16px', background:RED, color:'white', fontWeight:800, fontSize:'16px', borderRadius:'8px', border:'none', cursor:'pointer', marginBottom:'12px' }}>Continue with {PLANS.find(p=>p.id===selected)?.name} →</button>
        <p style={{ color:'#444', fontSize:'11px', textAlign:'center' }}>Cancel anytime · No hidden fees · Taxes may apply</p>
      </div>
    </div>
  )
}

// ── Payment ───────────────────────────────────────────────────────────────────
function PaymentScreen({ onBack, onSuccess, plan }:
  { onBack:()=>void; onSuccess:(price:string)=>void; plan:Plan }) {
  const planObj=PLANS.find(p=>p.id===plan)!
  const [cardNum,setCardNum]=useState(''); const [name,setName]=useState('')
  const [expiry,setExpiry]=useState(''); const [cvv,setCvv]=useState('')
  const [coupon,setCoupon]=useState(''); const [couponOpen,setCouponOpen]=useState(false)
  const [discount,setDiscount]=useState(0); const [couponMsg,setCouponMsg]=useState('')
  const [processing,setProcessing]=useState(false); const [errors,setErrors]=useState<Record<string,string>>({})
  const [method,setMethod]=useState<'card'|'paypal'|'apple'>('card'); const [foc,setFoc]=useState('')

  const COUPONS: Record<string,number> = { 'AIRA20':20, 'HANEDAN':15, 'WELCOME10':10, 'SAVE25':25 }
  const fmtCard=(v:string)=>v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const fmtExp=(v:string)=>{const n=v.replace(/\D/g,'').slice(0,4);return n.length>2?n.slice(0,2)+'/'+n.slice(2):n}
  const applyCoupon=()=>{
    const pct=COUPONS[coupon.toUpperCase()]
    if(pct){setDiscount(pct);setCouponMsg(`✓ ${pct}% off applied!`)}
    else{setCouponMsg('Invalid code. Try AIRA20')}
  }
  const validate=()=>{
    const e:Record<string,string>={}
    if(cardNum.replace(/\s/g,'').length<16)e.cardNum='Enter a valid 16-digit number'
    if(!name.trim())e.name='Name is required'
    if(expiry.length<5)e.expiry='Enter MM/YY'
    if(cvv.length<3)e.cvv='Enter CVV'
    setErrors(e); return Object.keys(e).length===0
  }
  const handlePay=()=>{
    if(method!=='card'){setProcessing(true);setTimeout(()=>onSuccess(discountedPrice),2000);return}
    if(!validate())return
    setProcessing(true); setTimeout(()=>onSuccess(discountedPrice),2200)
  }
  const discountedPrice=(planObj.price*(1-discount/100)).toFixed(2)
  const inp=(f:string):React.CSSProperties=>({ display:'block',width:'100%',marginTop:'8px',padding:'14px 16px',background:'#0F0F0F',border:`1.5px solid ${errors[f]?'#dc2626':foc===f?RED:'#2a2a2a'}`,borderRadius:'8px',color:'white',fontSize:'15px',outline:'none',transition:'border-color 0.2s',fontFamily:'Inter,sans-serif' })

  return (
    <div className="h-full flex flex-col" style={{ background:BG }}>
      <div className="flex items-center gap-3 px-4 pt-14 pb-4">
        <button onClick={onBack} style={{ color:'white', background:'transparent', border:'none', cursor:'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {[['✓','Plan','#46d369'],['2','Payment',RED],['3','Enjoy','#333']].map(([n,lbl,c],i)=>(
              <div key={lbl} className="flex items-center gap-1.5">
                {i>0 && <div style={{ width:'20px', height:'1px', background:'#2a2a2a' }}/>}
                <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:i===0?'black':'white', fontSize:'9px', fontWeight:700 }}>{n}</span>
                </div>
                <span style={{ fontSize:'10px', color:i<2?'white':'#444', fontWeight:i===1?700:400 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-8">
        <div className="flex items-center justify-between p-4 rounded-xl mb-5" style={{ background:SURFACE, border:'1px solid #2a2a2a' }}>
          <div><p style={{ color:'white', fontSize:'15px', fontWeight:700 }}>AIRA {planObj.name}</p><p style={{ color:'#555', fontSize:'12px' }}>{planObj.quality} · {planObj.devices} devices</p></div>
          <div style={{ textAlign:'right' }}>
            {discount>0 && <p style={{ color:'#555', fontSize:'11px', textDecoration:'line-through' }}>${planObj.price}/mo</p>}
            <p style={{ color:discount>0?'#46d369':'white', fontSize:'20px', fontWeight:800 }}>${discountedPrice}<span style={{ fontSize:'11px', color:'#555', fontWeight:400 }}>/mo</span></p>
          </div>
        </div>
        <p style={{ color:'#666', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'10px' }}>Payment Method</p>
        <div className="flex gap-2 mb-5">
          {(['card','paypal','apple'] as const).map(m=>(
            <button key={m} onClick={()=>setMethod(m)} className="flex-1 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ background:method===m?RED:SURFACE, color:method===m?'white':'#666', border:`1px solid ${method===m?RED:'#2a2a2a'}`, cursor:'pointer', transition:'all 0.15s' }}>
              {m==='card'?'💳 Card':m==='paypal'?'🅿 PayPal':'🍎 Apple'}
            </button>
          ))}
        </div>
        {method==='card' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label style={{ color:'#666', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase' }}>Card Number</label>
                <div className="flex gap-1">{['VISA','MC','AMEX'].map(b=><span key={b} style={{ fontSize:'8px', padding:'2px 5px', background:'#2a2a2a', color:'#555', borderRadius:'3px', fontWeight:700 }}>{b}</span>)}</div>
              </div>
              <input type="text" inputMode="numeric" value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} onFocus={()=>setFoc('cardNum')} onBlur={()=>setFoc('')} placeholder="0000 0000 0000 0000" style={inp('cardNum')}/>
              {errors.cardNum && <p style={{ color:'#dc2626', fontSize:'11px', marginTop:'4px' }}>{errors.cardNum}</p>}
            </div>
            <div>
              <label style={{ color:'#666', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase' }}>Cardholder Name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} onFocus={()=>setFoc('name')} onBlur={()=>setFoc('')} placeholder="Full name on card" style={inp('name')}/>
              {errors.name && <p style={{ color:'#dc2626', fontSize:'11px', marginTop:'4px' }}>{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ color:'#666', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase' }}>Expiry</label>
                <input type="text" inputMode="numeric" value={expiry} onChange={e=>setExpiry(fmtExp(e.target.value))} onFocus={()=>setFoc('exp')} onBlur={()=>setFoc('')} placeholder="MM/YY" style={inp('expiry')}/>
                {errors.expiry && <p style={{ color:'#dc2626', fontSize:'10px', marginTop:'4px' }}>{errors.expiry}</p>}
              </div>
              <div>
                <label style={{ color:'#666', fontSize:'11px', letterSpacing:'0.08em', textTransform:'uppercase' }}>CVV</label>
                <input type="password" inputMode="numeric" value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} onFocus={()=>setFoc('cvv')} onBlur={()=>setFoc('')} placeholder="•••" style={inp('cvv')}/>
                {errors.cvv && <p style={{ color:'#dc2626', fontSize:'10px', marginTop:'4px' }}>{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}
        {/* Coupon / Promo Code */}
        <button onClick={()=>setCouponOpen(v=>!v)} className="flex items-center justify-between w-full mt-5"
                style={{ background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
          <span style={{ color:discount>0?'#46d369':RED, fontSize:'13px', fontWeight:600 }}>
            {discount>0?`✓ ${discount}% discount applied`:'+ Coupon / Promo Code'}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={couponOpen?'white':'#555'} strokeWidth="2">
            <polyline points={couponOpen?'18 15 12 9 6 15':'6 9 12 15 18 9'}/>
          </svg>
        </button>
        {couponOpen && discount===0 && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <input type="text" value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Enter code (e.g. AIRA20)"
                     style={{ flex:1, padding:'12px 14px', background:'#0F0F0F', border:`1.5px solid ${foc==='coup'?RED:'#2a2a2a'}`, borderRadius:'8px', color:'white', fontSize:'14px', outline:'none', fontFamily:'Inter,monospace', letterSpacing:'0.08em' }} onFocus={()=>setFoc('coup')} onBlur={()=>setFoc('')}/>
              <button onClick={applyCoupon} style={{ padding:'12px 16px', background:coupon?RED:CARD, color:'white', fontWeight:700, fontSize:'13px', borderRadius:'8px', border:'none', cursor:'pointer' }}>Apply</button>
            </div>
            {couponMsg && <p style={{ color:couponMsg.startsWith('✓')?'#46d369':'#dc2626', fontSize:'12px' }}>{couponMsg}</p>}
            <p style={{ color:'#333', fontSize:'11px' }}>Valid codes: AIRA20 · HANEDAN · WELCOME10 · SAVE25</p>
          </div>
        )}
        <button onClick={handlePay} disabled={processing}
                style={{ width:'100%', marginTop:'24px', padding:'17px', background:processing?'#333':RED, color:'white', fontWeight:800, fontSize:'16px', borderRadius:'8px', border:'none', cursor:processing?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          {processing ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white spin"/><span>Processing…</span></> : <>🔒 Pay ${discountedPrice}/month</>}
        </button>
        <p style={{ color:'#333', fontSize:'11px', textAlign:'center', marginTop:'10px' }}>256-bit SSL · PCI DSS Compliant · Cancel anytime</p>
      </div>
    </div>
  )
}

// ── Success ───────────────────────────────────────────────────────────────────
function SuccessScreen({ plan, discountedPrice, onDone }:
  { plan:Plan; discountedPrice:string; onDone:()=>void }) {
  const planObj=PLANS.find(p=>p.id===plan)!
  const [step,setStep]=useState(0)
  useEffect(()=>{
    const t1=setTimeout(()=>setStep(1),300); const t2=setTimeout(()=>setStep(2),800); const t3=setTimeout(()=>setStep(3),1300)
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3)}
  },[])
  const invoiceNo=`AIRA-${Date.now().toString().slice(-6)}`
  const today=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
  return (
    <div className="h-full overflow-y-auto scrollbar-hide flex flex-col items-center justify-center px-6 py-8" style={{ background:`radial-gradient(ellipse at 50% 40%, #200 0%, ${BG} 65%)` }}>
      <div className={step>=1?'animate-pop-in':''} style={{ opacity:step>=1?1:0, marginBottom:'20px' }}>
        <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:`${RED}20`, border:`3px solid ${RED}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
      <div className={step>=2?'animate-fade-up':''} style={{ opacity:step>=2?1:0, textAlign:'center', animationDelay:'0.05s' }}>
        <h2 style={{ color:'white', fontSize:'24px', fontWeight:900, marginBottom:'6px' }}>You&apos;re all set!</h2>
        <p style={{ color:'#888', fontSize:'13px' }}>AIRA {planObj.name} is now active.</p>
      </div>
      <div className={`w-full mt-6 ${step>=3?'animate-fade-up':''}`} style={{ opacity:step>=3?1:0, animationDelay:'0.1s' }}>
        {/* Invoice */}
        <div className="p-4 rounded-xl mb-4" style={{ background:SURFACE, border:'1px solid #2a2a2a' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color:'#555', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase' }}>Invoice</span>
            <span style={{ color:'#555', fontSize:'11px' }}>{invoiceNo}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color:'#aaa', fontSize:'13px' }}>AIRA {planObj.name} Plan</span>
            <span style={{ color:'white', fontSize:'13px', fontWeight:600 }}>${discountedPrice}/mo</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color:'#555', fontSize:'12px' }}>Billing Date</span>
            <span style={{ color:'#666', fontSize:'12px' }}>{today}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color:'#555', fontSize:'12px' }}>Next Renewal</span>
            <span style={{ color:'#666', fontSize:'12px' }}>In 30 days</span>
          </div>
          <div style={{ borderTop:'1px solid #2a2a2a', marginTop:'12px', paddingTop:'12px' }} className="flex items-center justify-between">
            <span style={{ color:'white', fontWeight:700, fontSize:'14px' }}>Total Charged</span>
            <span style={{ color:RED, fontWeight:800, fontSize:'16px' }}>${discountedPrice}</span>
          </div>
        </div>
        {planObj.features.map(f=>(
          <div key={f} className="flex items-center gap-2 mb-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ color:'#aaa', fontSize:'12px' }}>{f}</span>
          </div>
        ))}
        <button onClick={onDone} style={{ width:'100%', marginTop:'20px', padding:'16px', background:RED, color:'white', fontWeight:800, fontSize:'16px', borderRadius:'8px', border:'none', cursor:'pointer' }}>Start Watching →</button>
        <button onClick={()=>toast('Invoice downloaded to your device','📄')} style={{ width:'100%', marginTop:'10px', padding:'10px', background:'transparent', color:'#555', border:'1px solid #2a2a2a', borderRadius:'8px', fontSize:'13px', cursor:'pointer' }}>📄 Download Invoice (PDF)</button>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState<Screen>('splash')
  const [tab,setTab]=useState<Tab>('home')
  const [detail,setDetail]=useState<Show|null>(null)
  const [player,setPlayer]=useState<Show|null>(null)
  const [myList,setMyList]=useState<number[]>([1,5,8,20])
  const [downloads,setDownloads]=useState<number[]>([1,6])
  const [likes,setLikes]=useState<number[]>([1,5,8])
  const [dislikes,setDislikes]=useState<number[]>([])
  const [userPlan,setUserPlan]=useState<Plan>('standard')
  const [selectedPlan,setSelectedPlan]=useState<Plan>('premium')
  const [lastPrice,setLastPrice]=useState('22.99')

  const toggleList=(id:number)=>setMyList(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const toggleLike=(id:number)=>{setLikes(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);setDislikes(p=>p.filter(x=>x!==id))}
  const toggleDislike=(id:number)=>{setDislikes(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);setLikes(p=>p.filter(x=>x!==id))}
  const toggleDownload=(id:number)=>setDownloads(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const handleSelect=(s:Show)=>{setPlayer(null);setDetail(s)}
  const handlePlay=(s:Show)=>{setDetail(null);setPlayer(s)}

  if(screen==='splash') return <PhoneFrame><SplashScreen onDone={()=>setScreen('login')}/></PhoneFrame>
  if(screen==='login') return <PhoneFrame><LoginScreen onLogin={()=>setScreen('profiles')}/></PhoneFrame>
  if(screen==='profiles') return <PhoneFrame><ProfileSelect onSelect={()=>setScreen('main')}/></PhoneFrame>
  if(screen==='subscribe') return (
    <PhoneFrame><SubscribeScreen onBack={()=>setScreen('main')} onNext={()=>setScreen('payment')} selected={selectedPlan} onSelect={setSelectedPlan} currentPlan={userPlan}/></PhoneFrame>
  )
  if(screen==='payment') return (
    <PhoneFrame><PaymentScreen onBack={()=>setScreen('subscribe')} onSuccess={(p)=>{setLastPrice(p);setScreen('success')}} plan={selectedPlan}/></PhoneFrame>
  )
  if(screen==='success') return (
    <PhoneFrame><SuccessScreen plan={selectedPlan} discountedPrice={lastPrice} onDone={()=>{setUserPlan(selectedPlan);setScreen('main')}}/></PhoneFrame>
  )

  return (
    <PhoneFrame>
      <div className="h-full flex flex-col relative" style={{ background:BG }}>
        <Toast />
        {tab==='home' && <HomeScreen onSelect={handleSelect} myList={myList}/>}
        {tab==='search' && <SearchScreen onSelect={handleSelect}/>}
        {tab==='hot' && <NewHotScreen onSelect={handleSelect}/>}
        {tab==='myaira' && (
          <MyAIRAScreen onSelect={handleSelect} myList={myList} downloads={downloads}
                        onDeleteDownload={id=>setDownloads(p=>p.filter(x=>x!==id))}
                        onSignOut={()=>setScreen('login')} userPlan={userPlan} onSubscribe={()=>setScreen('subscribe')}/>
        )}
        <BottomNav tab={tab} setTab={t=>{setDetail(null);setPlayer(null);setTab(t)}}/>
        {detail && (
          <DetailScreen show={detail} onBack={()=>setDetail(null)} onPlay={handlePlay}
                        myList={myList} onToggle={toggleList} likes={likes} dislikes={dislikes}
                        onLike={toggleLike} onDislike={toggleDislike}
                        downloads={downloads} onDownload={toggleDownload}
                        userPlan={userPlan} onSubscribe={()=>setScreen('subscribe')}/>
        )}
        {player && <PlayerScreen show={player} onBack={()=>setPlayer(null)}/>}
      </div>
    </PhoneFrame>
  )
}
