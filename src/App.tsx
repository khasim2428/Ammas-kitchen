import { useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, CalendarDays, Check, ChefHat, ChevronDown, Clock3, Heart,
  Leaf, MapPin, Menu, MessageCircle, ShieldCheck, Sparkles, Star, Utensils, X,
} from 'lucide-react'
import { supabase } from './lib/supabase'

type Diet = 'Veg' | 'Non-Veg'
type Page = 'Home' | 'Plans' | 'Weekly Menu' | 'My Tiffin' | 'Bulk Orders' | 'Contact' | 'Admin'
type Plan = { name: string; veg: number; nonVeg: number; vegItems: string[]; nonVegItems: string[]; badge?: string }

const plans: Plan[] = [
  { name: 'Basic Lunch', veg: 3499, nonVeg: 3999, vegItems: ['Rice / roti', 'Dal / sambar', 'Rasam', 'Seasonal veg curries', 'Curd', 'Pickle / chutney'], nonVegItems: ['Rice / roti', 'Chicken curry · 2 days/week', 'Egg curry · 3 days/week', 'Dal / sambar', 'Pickle / chutney'] },
  { name: 'Premium Lunch', veg: 4499, nonVeg: 4999, badge: 'MOST LOVED', vegItems: ['Rice / roti', 'Veg curry / fry', 'Dal / sambar', 'Curd / buttermilk', 'Pickle / chutney', 'Weekly specials · rasam', 'Flexible menu · 1 day/week'], nonVegItems: ['Rice / roti', 'Chicken curry · 2 days/week', 'Fish fry · 1 day/week', 'Egg curry · 2 days/week', 'Dal / sambar', 'Pickle / chutney', 'Weekly non-veg specials', 'Flexible menu · 1 day/week'] },
  { name: 'Ultra · All Day', veg: 5999, nonVeg: 6999, vegItems: ['Breakfast + lunch + dinner', 'Freshly cooked every day', 'Veg menu tailored for you'], nonVegItems: ['Breakfast + lunch + dinner', 'Freshly cooked every day', 'Non-veg menu tailored for you'] },
]
const ultraOptions = [
  { title: 'Breakfast + Lunch + Dinner', veg: 5999, nonVeg: 6999 },
  { title: 'Breakfast + Lunch', veg: 5499, nonVeg: 5999 },
  { title: 'Lunch + Dinner', veg: 5499, nonVeg: 6499 },
]
const navItems: Page[] = ['Home', 'Plans', 'Weekly Menu', 'My Tiffin', 'Bulk Orders', 'Contact']
const menuDays = [
  ['MON', 'Lemon rice', 'Tomato pappu', 'Seasonal beans poriyal', 'Egg curry'],
  ['TUE', 'Steamed rice', 'Sambar & rasam', 'Aloo fry', 'Chicken curry'],
  ['WED', 'Soft phulkas', 'Dal tadka', 'Gutti vankaya', 'Egg curry'],
  ['THU', 'Jeera rice', 'Veg kurma', 'Cabbage thoran', 'Chicken curry'],
  ['FRI', 'Curd rice', 'Mango dal', 'Crispy okra', 'Fish fry special'],
]
const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

export default function App() {
  const [page, setPage] = useState<Page>('Home')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'తె'>('EN')
  const [diet, setDiet] = useState<Diet>('Veg')
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [ultraOption, setUltraOption] = useState(0)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', startDate: '' })
  const [otpPhone, setOtpPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [paused, setPaused] = useState<number[]>([])
  const [bulkSent, setBulkSent] = useState(false)
  const [activeAdmin, setActiveAdmin] = useState('Subscriptions')
  const [adminPlans, setAdminPlans] = useState(plans.map((plan) => ({ ...plan })))
  const currentPlan = adminPlans[selectedPlan]
  const selectedPrice = selectedPlan === 2
    ? ultraOptions[ultraOption][diet === 'Veg' ? 'veg' : 'nonVeg']
    : currentPlan[diet === 'Veg' ? 'veg' : 'nonVeg']

  const navigate = (next: Page) => { setPage(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openSubscribe = (planIndex = selectedPlan) => { setSelectedPlan(planIndex); setSubscribeOpen(true); setConfirmed(false) }
  const togglePause = (day: number) => setPaused((days) => days.includes(day) ? days.filter((item) => item !== day) : [...days, day])
  const today = useMemo(() => new Date().getDate(), [])

  async function sendOtp() {
    if (!/^\+?[0-9\s-]{8,15}$/.test(otpPhone)) { window.alert('Enter a valid phone number with country code.'); return }
    if (!supabase) { setOtpSent(true); window.alert('Demo mode: add Supabase credentials in .env to send a real OTP.'); return }
    const { error } = await supabase.auth.signInWithOtp({ phone: otpPhone })
    if (error) window.alert(error.message)
    else setOtpSent(true)
  }

  async function placeSubscription() {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.startDate) {
      window.alert('Please complete all fields to continue.'); return
    }
    if (supabase) {
      const { error } = await supabase.from('subscriptions').insert({
        customer_name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(),
        plan_name: selectedPlan === 2 ? `${currentPlan.name} · ${ultraOptions[ultraOption].title}` : currentPlan.name,
        diet, monthly_price: selectedPrice, start_date: form.startDate, status: 'pending',
      })
      if (error) { window.alert(`Could not save the subscription: ${error.message}`); return }
    }
    setConfirmed(true)
  }

  return <div className="app-shell">
    <div className="announcement"><Sparkles size={14} /> Homemade with love, delivered fresh in Hyderabad <span className="announcement-dot">·</span> <a href="tel:6302041792">Call to order</a></div>
    <header className="site-header">
      <button className="brand" onClick={() => navigate('Home')} aria-label="Amma's Kitchen home">
        <span className="brand-icon"><ChefHat size={24} /></span><span><strong>Amma's Kitchen</strong><small>HOMEMADE TASTE ♥ EVERYDAY</small></span>
      </button>
      <nav className="desktop-nav">{navItems.map((item) => <button className={page === item ? 'nav-link active' : 'nav-link'} key={item} onClick={() => navigate(item)}>{item}</button>)}</nav>
      <div className="header-actions"><button className="language-toggle" onClick={() => setLanguage(language === 'EN' ? 'తె' : 'EN')}>{language === 'EN' ? 'తెలుగు' : 'English'} <ChevronDown size={13} /></button><button className="button button-small button-dark" onClick={() => openSubscribe()}>Order now <ArrowRight size={15} /></button><button className="icon-button mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button></div>
      {mobileMenu && <nav className="mobile-nav">{navItems.map((item) => <button key={item} onClick={() => navigate(item)}>{item}<ArrowRight size={15} /></button>)}<button onClick={() => navigate('Admin')}>Admin panel <ArrowRight size={15} /></button></nav>}
    </header>

    {page === 'Home' && <>
      <main>
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> YOUR EVERYDAY COMFORT FOOD</div><h1>A little taste<br />of <em>home.</em></h1><p className="hero-subtitle">Wholesome, home-cooked meals made fresh each morning and brought right to your door.</p><div className="hero-actions"><button className="button button-primary" onClick={() => navigate('Plans')}>Explore monthly plans <ArrowRight size={16} /></button><button className="text-link" onClick={() => navigate('Weekly Menu')}>See this week's menu <ArrowDown size={15} /></button></div><div className="hero-social"><span className="avatar-stack"><i>👩🏽‍🍳</i><i>🍱</i><i>💚</i></span><span><strong>Made like home, loved by Hyderabad.</strong><small>Fresh every day · No shortcuts</small></span><span className="rating"><Star size={14} fill="currentColor" /> 4.9</span></div></div>
          <div className="hero-art"><div className="art-sun" /><div className="hero-image" role="img" aria-label="Traditional South Indian vegetarian lunch served on a banana leaf" /><div className="floating-note"><span className="note-heart"><Heart size={16} fill="currentColor" /></span><span><strong>Freshly made</strong><small>Just like Amma's</small></span></div><div className="hero-caption"><Leaf size={14} /> A meal made with care</div></div>
          <div className="hero-mark">EST.<br /><b>2024</b><br />HYD</div>
        </section>

        <section className="usp-strip"><div className="usp-item"><span className="usp-icon"><Leaf /></span><span><strong>Fresh ingredients</strong><small>Market-fresh, every morning</small></span></div><div className="usp-item"><span className="usp-icon"><ShieldCheck /></span><span><strong>Hygienic preparation</strong><small>Clean kitchen, careful hands</small></span></div><div className="usp-item"><span className="usp-icon"><Clock3 /></span><span><strong>Timely delivery</strong><small>At your door, right on time</small></span></div><div className="usp-item"><span className="usp-icon"><Heart /></span><span><strong>Plans for every table</strong><small>Honest, affordable monthly plans</small></span></div></section>

        <section className="section plans-preview" id="plans"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> OUR MONTHLY TIFFINS</div><h2>Good food, <em>good days.</em></h2></div><button className="text-link desktop-only" onClick={() => navigate('Plans')}>View all plans <ArrowRight size={15} /></button></div><DietToggle diet={diet} setDiet={setDiet} /><div className="plan-grid">{adminPlans.map((plan, index) => <PlanCard key={plan.name} plan={plan} index={index} diet={diet} selected={index === selectedPlan} onSelect={() => { setSelectedPlan(index); if (index === 2) setUltraOption(0) }} onOrder={() => openSubscribe(index)} ultraOption={ultraOption} setUltraOption={setUltraOption} />)}</div></section>

        <section className="quote-band"><div className="quote-mark">“</div><p>Every meal carries a little bit of home.<br /><em>That's our promise to you.</em></p><span>— Amma's Kitchen</span></section>
        <section className="cta-card"><div><div className="eyebrow">YOUR NEXT FAVOURITE MEAL IS A CLICK AWAY</div><h2>Let us take care<br />of lunch.</h2><p>Choose your plan. We'll take it from there.</p></div><button className="button button-cream" onClick={() => navigate('Plans')}>Book your monthly plan <ArrowRight size={16} /></button><div className="cta-pattern">✳</div></section>
      </main>
    </>}

    {page === 'Plans' && <main className="page-container"><PageIntro eyebrow="A PLAN FOR EVERYDAY" title={<>Pick your <em>kind of good.</em></>} subtitle="Simple monthly plans, cooked with care. Pause whenever life gets busy." /><DietToggle diet={diet} setDiet={setDiet} /><div className="plan-grid plans-page-grid">{adminPlans.map((plan, index) => <PlanCard key={plan.name} plan={plan} index={index} diet={diet} selected={index === selectedPlan} onSelect={() => setSelectedPlan(index)} onOrder={() => openSubscribe(index)} ultraOption={ultraOption} setUltraOption={setUltraOption} />)}</div><div className="plans-note"><ShieldCheck size={19} /><span><strong>Flexible by nature.</strong> Premium includes one flexible-menu day per week. Need something different? <button onClick={() => navigate('Contact')}>Talk to us</button></span></div></main>}

    {page === 'Weekly Menu' && <main className="page-container"><PageIntro eyebrow="FROM OUR KITCHEN THIS WEEK" title={<>The week's <em>good things.</em></>} subtitle="A little preview of the fresh, home-style menu we're cooking up." /><div className="menu-week-label"><CalendarDays size={17} /> This week's lunch menu <span>·</span> <b>Non-veg days marked in terracotta</b></div><div className="weekly-menu">{menuDays.map((day, index) => <article className="menu-day" key={day[0]}><div className="day-label"><span>{day[0]}</span><small>{['01', '02', '03', '04', '05'][index]}</small></div><div className="day-dishes">{day.slice(1, 4).map((dish, i) => <span className={i === 0 ? 'dish-main' : ''} key={dish}>{dish}</span>)}</div><div className="nonveg-special"><span>NON-VEG OPTION</span><b><i />{day[4]}</b></div></article>)}</div><div className="menu-disclaimer">Menu may change based on seasonal availability. A fresh menu is shared with subscribers each week.</div></main>}

    {page === 'My Tiffin' && <main className="page-container"><PageIntro eyebrow="YOUR LITTLE CORNER" title={<>Hello, <em>there.</em></>} subtitle="Your meals, your schedule. Manage your plan right here." /><div className="dashboard-grid"><section className="dashboard-card active-plan-card"><div className="card-kicker"><span className="status-dot" /> ACTIVE PLAN</div><h3>Premium Lunch <span className="diet-pill veg-pill">● Veg</span></h3><p>Home-style goodness, Monday to Saturday</p><div className="plan-details-row"><div><small>MONTHLY PLAN</small><strong>₹4,499<span>/mo</span></strong></div><div><small>STARTED ON</small><strong>Oct 01, 2026</strong></div><div><small>NEXT RENEWAL</small><strong>Nov 01, 2026</strong></div></div><button className="button button-outline" onClick={() => openSubscribe(1)}>Manage plan <ArrowRight size={15} /></button></section><section className="dashboard-card today-menu-card"><div className="card-kicker"><ChefHat size={15} /> ON THE MENU TODAY</div><div className="today-date">Wednesday, October {today}</div><h3>Comfort in every bite.</h3><ul><li>Steamed rice & soft rotis</li><li>Tomato pappu & rasam</li><li>Seasonal vegetable curry</li><li>Curd, pickle & a little sweet</li></ul><button className="text-link" onClick={() => navigate('Weekly Menu')}>See weekly menu <ArrowRight size={14} /></button></section></div><section className="calendar-card dashboard-card"><div className="calendar-heading"><div><div className="card-kicker"><CalendarDays size={15} /> YOUR DELIVERY CALENDAR</div><h3>October 2026</h3></div><span className="calendar-legend"><i /> Scheduled <i className="legend-paused" /> Paused</span></div><div className="calendar-grid">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span className="weekday" key={`${day}${index}`}>{day}</span>)}{Array.from({ length: 3 }, (_, i) => <span className="empty-day" key={`empty${i}`} />)}{Array.from({ length: 31 }, (_, i) => i + 1).map((day) => <button key={day} className={`${day === today ? 'calendar-today' : ''} ${paused.includes(day) ? 'calendar-paused' : day % 7 === 0 ? 'calendar-off' : ''}`} onClick={() => day >= today && day % 7 !== 0 && togglePause(day)} title={day < today ? 'Past date' : day % 7 === 0 ? 'Sunday — no delivery' : paused.includes(day) ? 'Tap to resume delivery' : 'Tap to skip this day'}>{day}{day >= today && day % 7 !== 0 && <i />}</button>)}</div><p className="calendar-help">Tap an upcoming delivery day to pause or resume. Sundays are off.</p></section><div className="demo-note">You're seeing a sample customer view. Sign in with your phone to link your real subscription.</div></main>}

    {page === 'Bulk Orders' && <main className="page-container"><PageIntro eyebrow="GATHER AROUND SOMETHING GOOD" title={<>A table full of <em>happy.</em></>} subtitle="Birthdays, office lunches, family functions—we'll bring the homemade goodness." /><div className="bulk-layout"><div className="bulk-story"><span className="bulk-icon"><Utensils /></span><h3>Made for sharing.</h3><p>From intimate get-togethers to office-wide lunches, our kitchen can make your occasion extra special.</p><ul><li><Check /> Freshly prepared for your group</li><li><Check /> Veg and non-veg choices</li><li><Check /> Menus tailored to your occasion</li></ul><div className="bulk-quote">“The best gatherings end with one more serving.”</div></div><form className="bulk-form" onSubmit={(event) => { event.preventDefault(); setBulkSent(true) }}><div className="form-title">Tell us what you're celebrating</div>{bulkSent ? <div className="success-state"><span><Check /></span><h3>We got your request!</h3><p>Our team will call you shortly to plan a delicious day.</p><button type="button" className="text-link" onClick={() => setBulkSent(false)}>Send another enquiry</button></div> : <><label>Occasion<input required placeholder="e.g. Birthday, office lunch" /></label><div className="form-row"><label>Number of people<input required type="number" min="1" placeholder="25" /></label><label>Date<input required type="date" min={new Date().toISOString().slice(0, 10)} /></label></div><label>Food preference<select defaultValue=""><option value="" disabled>Select preference</option><option>Vegetarian</option><option>Non-vegetarian</option><option>Both veg & non-veg</option></select></label><label>Anything else? <span className="optional-label">(optional)</span><textarea rows={3} placeholder="Share your menu preferences or special requests" /></label><button className="button button-primary full-width">Send enquiry <ArrowRight size={16} /></button><small className="privacy-note">We'll only use your details to get in touch about your event.</small></>}</form></div></main>}

    {page === 'Contact' && <main className="page-container"><PageIntro eyebrow="WE'RE RIGHT HERE" title={<>Come say <em>hello.</em></>} subtitle="Questions about the menu, your plan, or just craving a good meal? We’d love to hear from you." /><div className="contact-grid"><a href="tel:6302041792" className="contact-card"><span><MessageCircle /></span><small>CALL OUR KITCHEN</small><strong>63020 41792</strong><span className="contact-link">Call now <ArrowRight size={14} /></span></a><a href="tel:9553007896" className="contact-card"><span><MessageCircle /></span><small>OR REACH AMMA</small><strong>95530 07896</strong><span className="contact-link">Call now <ArrowRight size={14} /></span></a><a href="https://wa.me/916302041792?text=Hi%20Amma's%20Kitchen!%20I'd%20love%20to%20know%20about%20your%20monthly%20plans." target="_blank" rel="noreferrer" className="contact-card whatsapp-card"><span><MessageCircle /></span><small>QUICK HELLO</small><strong>WhatsApp us</strong><span className="contact-link">Start a chat <ArrowRight size={14} /></span></a></div><div className="location-card"><span><MapPin /></span><div><strong>Cooking with love in Hyderabad</strong><small>Serving homes and offices across Hyderabad. Delivery availability depends on your area.</small></div><span className="location-tag">IN HYDERABAD</span></div></main>}

    {page === 'Admin' && <main className="page-container admin-page"><PageIntro eyebrow="KITCHEN CONTROL ROOM" title={<>The daily <em>details.</em></>} subtitle="Manage the little things that make every meal special." /><div className="admin-tabs">{['Subscriptions', 'Bulk enquiries', 'Menu & prices', 'Delivery list'].map((tab) => <button key={tab} className={activeAdmin === tab ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveAdmin(tab)}>{tab}</button>)}</div>{activeAdmin === 'Subscriptions' && <AdminSubscriptions />}{activeAdmin === 'Bulk enquiries' && <AdminEnquiries />}{activeAdmin === 'Menu & prices' && <div className="admin-panel"><div className="table-title"><div><h3>Plan pricing</h3><p>Prices are monthly and shown in Indian rupees.</p></div><span className="saved-label"><Check size={14} /> Changes save in this session</span></div><div className="price-table"><div className="price-row price-head"><span>Package</span><span>Veg / month</span><span>Non-veg / month</span></div>{adminPlans.map((plan, index) => <div className="price-row" key={plan.name}><span><strong>{plan.name}</strong><small>Customer-facing monthly price</small></span><label className="price-input"><span>₹</span><input type="number" value={plan.veg} onChange={(event) => setAdminPlans((current) => current.map((item, i) => i === index ? { ...item, veg: Number(event.target.value) } : item))} /></label><label className="price-input"><span>₹</span><input type="number" value={plan.nonVeg} onChange={(event) => setAdminPlans((current) => current.map((item, i) => i === index ? { ...item, nonVeg: Number(event.target.value) } : item))} /></label></div>)}</div><div className="admin-note">Price changes update the plan cards immediately. Add Supabase tables to save changes across sessions.</div></div>}{activeAdmin === 'Delivery list' && <DeliveryList />}</main>}

    <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><span className="brand-icon"><ChefHat size={23} /></span><span><strong>Amma's Kitchen</strong><small>HOMEMADE TASTE ♥ EVERYDAY</small></span></div><p>Good food brings us home.</p><div className="footer-links">{navItems.slice(1).map((item) => <button key={item} onClick={() => navigate(item)}>{item}</button>)}<button onClick={() => navigate('Admin')}>Admin</button></div></div><div className="footer-bottom"><span>© 2026 Amma's Kitchen · Hyderabad</span><strong>Eat Healthy, Stay Happy <Heart size={13} fill="currentColor" /></strong><span>Made fresh, with love.</span></div></footer>
    <div className="mobile-sticky-cta"><span>Plans from <strong>₹3,499/mo</strong></span><button className="button button-primary" onClick={() => openSubscribe()}>Order now <ArrowRight size={15} /></button></div>

    {subscribeOpen && <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setSubscribeOpen(false) }}><section className="subscribe-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-title"><div className="modal-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> ONE STEP CLOSER TO HOME</div><h2 id="subscribe-title">{confirmed ? 'Your table is set.' : 'Let’s get you fed.'}</h2></div><button className="icon-button" onClick={() => setSubscribeOpen(false)} aria-label="Close"><X size={19} /></button></div>{confirmed ? <div className="success-state subscription-success"><span><Check /></span><h3>Thanks, {form.name.split(' ')[0]}!</h3><p>Your {diet.toLowerCase()} {selectedPlan === 2 ? ultraOptions[ultraOption].title.toLowerCase() : currentPlan.name.toLowerCase()} request is in. Our kitchen team will call to confirm delivery details.</p><div className="success-summary"><span>Monthly total</span><strong>{rupees(selectedPrice)}</strong><small>UPI payment available after confirmation</small></div><button className="button button-primary full-width" onClick={() => { setSubscribeOpen(false); navigate('My Tiffin') }}>Go to my tiffin <ArrowRight size={16} /></button></div> : <><div className="modal-progress"><span className="progress-active" /><span /><span /></div><div className="subscribe-selectors"><label>Package<select value={selectedPlan} onChange={(event) => setSelectedPlan(Number(event.target.value))}>{adminPlans.map((plan, index) => <option value={index} key={plan.name}>{plan.name}</option>)}</select></label><label>Food preference<div className="modal-diet"><button className={diet === 'Veg' ? 'modal-diet-active veg-active' : ''} onClick={() => setDiet('Veg')}><i /> Veg</button><button className={diet === 'Non-Veg' ? 'modal-diet-active nonveg-active' : ''} onClick={() => setDiet('Non-Veg')}><i /> Non-Veg</button></div></label></div>{selectedPlan === 2 && <label className="ultra-select">Meal schedule<select value={ultraOption} onChange={(event) => setUltraOption(Number(event.target.value))}>{ultraOptions.map((option, index) => <option value={index} key={option.title}>{option.title} · {rupees(option[diet === 'Veg' ? 'veg' : 'nonVeg'])}</option>)}</select></label>}<div className="order-summary"><div><span>{selectedPlan === 2 ? ultraOptions[ultraOption].title : currentPlan.name} · {diet}</span><strong>{rupees(selectedPrice)}<small> / month</small></strong></div><small>Includes freshly prepared meals Monday–Saturday</small></div><form onSubmit={(event) => { event.preventDefault(); void placeSubscription() }} className="subscribe-form"><div className="form-row"><label>Your name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" /></label><label>Phone number<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+91 98765 43210" type="tel" /></label></div><label>Delivery address<input required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Flat, street, area in Hyderabad" /></label><label>Preferred start date<input required min={new Date().toISOString().slice(0, 10)} type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label><button className="button button-primary full-width">Continue to order summary <ArrowRight size={16} /></button><p className="payment-note"><ShieldCheck size={14} /> No payment now. UPI payment is arranged after we confirm your plan.</p></form><div className="otp-divider"><span />Optional: sign in with phone OTP<span /></div><div className="otp-row"><input aria-label="Phone for OTP" placeholder="Phone number with country code" value={otpPhone} onChange={(event) => setOtpPhone(event.target.value)} /><button onClick={() => void sendOtp()}>{otpSent ? 'OTP sent' : 'Send OTP'}</button></div></>}</section></div>}
  </div>
}

function PageIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle: string }) {
  return <div className="page-intro"><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>
}
function DietToggle({ diet, setDiet }: { diet: Diet; setDiet: (diet: Diet) => void }) {
  return <div className="diet-toggle" role="group" aria-label="Choose food preference"><button onClick={() => setDiet('Veg')} className={diet === 'Veg' ? 'diet-active veg-active' : ''}><i /> Veg</button><button onClick={() => setDiet('Non-Veg')} className={diet === 'Non-Veg' ? 'diet-active nonveg-active' : ''}><i /> Non-Veg</button></div>
}
function PlanCard({ plan, index, diet, selected, onSelect, onOrder, ultraOption, setUltraOption }: { plan: Plan; index: number; diet: Diet; selected: boolean; onSelect: () => void; onOrder: () => void; ultraOption: number; setUltraOption: (index: number) => void }) {
  const price = index === 2 ? ultraOptions[ultraOption][diet === 'Veg' ? 'veg' : 'nonVeg'] : plan[diet === 'Veg' ? 'veg' : 'nonVeg']
  const items = plan[diet === 'Veg' ? 'vegItems' : 'nonVegItems']
  return <article className={`plan-card ${selected ? 'plan-card-selected' : ''} ${index === 1 ? 'plan-card-featured' : ''}`} onClick={onSelect}><div className="plan-card-top">{plan.badge ? <span className="plan-badge"><Sparkles size={12} /> {plan.badge}</span> : <span className="plan-number">0{index + 1} / MONTHLY</span>}<span className={`diet-pill ${diet === 'Veg' ? 'veg-pill' : 'nonveg-pill'}`}>● {diet}</span></div><h3>{plan.name}</h3>{index === 2 && <div className="ultra-options">{ultraOptions.map((option, optionIndex) => <button key={option.title} className={ultraOption === optionIndex ? 'ultra-option-active' : ''} onClick={(event) => { event.stopPropagation(); setUltraOption(optionIndex) }}><span>{option.title}</span><strong>{rupees(option[diet === 'Veg' ? 'veg' : 'nonVeg'])}</strong></button>)}</div>}<div className="plan-price"><strong>{rupees(price)}</strong><span>/ month</span></div><div className="plan-rule" /><div className="included-label">A LITTLE OF WHAT'S INCLUDED</div><ul className="plan-items">{items.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul><button className={index === 1 ? 'button button-primary full-width' : 'button button-outline full-width'} onClick={(event) => { event.stopPropagation(); onOrder() }}>Choose this plan <ArrowRight size={15} /></button></article>
}
function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([
    { name: 'Lakshmi Reddy', phone: '•••••• 2841', plan: 'Premium Lunch · Veg', amount: 4499, area: 'Madhapur', status: 'Active' },
    { name: 'Arjun Rao', phone: '•••••• 6190', plan: 'Basic Lunch · Non-Veg', amount: 3999, area: 'Kondapur', status: 'Pending' },
    { name: 'Meera Kumar', phone: '•••••• 5032', plan: 'Ultra · Veg', amount: 5499, area: 'Gachibowli', status: 'Active' },
    { name: 'Sai Prakash', phone: '•••••• 7718', plan: 'Basic Lunch · Veg', amount: 3499, area: 'Jubilee Hills', status: 'Paused' },
  ])
  return <div className="admin-panel"><div className="table-title"><div><h3>Recent subscriptions</h3><p>Sample records for preview. Live customer records load from Supabase.</p></div><span className="record-count">{subscriptions.length} records</span></div><div className="responsive-table"><table><thead><tr><th>CUSTOMER</th><th>PLAN</th><th>AREA</th><th>MONTHLY</th><th>STATUS</th></tr></thead><tbody>{subscriptions.map((sub, index) => <tr key={sub.name}><td><strong>{sub.name}</strong><small>{sub.phone}</small></td><td>{sub.plan}</td><td>{sub.area}</td><td>{rupees(sub.amount)}</td><td><button className={`status-pill status-${sub.status.toLowerCase()}`} onClick={() => setSubscriptions((records) => records.map((record, i) => i === index ? { ...record, status: record.status === 'Active' ? 'Paused' : 'Active' } : record))}>{sub.status} <ChevronDown size={12} /></button></td></tr>)}</tbody></table></div><div className="admin-note">Tap a status to toggle Active / Paused. Phone numbers are masked in this preview.</div></div>
}
function AdminEnquiries() {
  const [enquiries] = useState([
    { occasion: 'Office team lunch', date: 'Oct 24, 2026', guests: 35, preference: 'Veg & Non-Veg', area: 'Hitech City', status: 'New' },
    { occasion: 'Birthday gathering', date: 'Oct 29, 2026', guests: 22, preference: 'Vegetarian', area: 'Banjara Hills', status: 'Contacted' },
  ])
  return <div className="admin-panel"><div className="table-title"><div><h3>Bulk order enquiries</h3><p>New event requests from customers.</p></div><span className="record-count">{enquiries.filter((item) => item.status === 'New').length} new</span></div><div className="responsive-table"><table><thead><tr><th>OCCASION</th><th>DATE</th><th>GUESTS</th><th>FOOD</th><th>AREA</th><th>STATUS</th></tr></thead><tbody>{enquiries.map((item) => <tr key={item.occasion}><td><strong>{item.occasion}</strong></td><td>{item.date}</td><td>{item.guests}</td><td>{item.preference}</td><td>{item.area}</td><td><span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span></td></tr>)}</tbody></table></div><div className="admin-note">Sample enquiries shown. Connect the bulk_enquiries table to see customer requests.</div></div>
}
function DeliveryList() {
  const [area, setArea] = useState('All areas')
  const deliveries = [
    { name: 'Lakshmi Reddy', area: 'Madhapur', address: 'Ayyappa Society, lane 4', plan: 'Premium Veg', phone: '63005 •• 2841' },
    { name: 'Arjun Rao', area: 'Kondapur', address: 'Botanical Garden Road', plan: 'Basic Non-Veg', phone: '88975 •• 6190' },
    { name: 'Meera Kumar', area: 'Gachibowli', address: 'DLF Cyber City, Block 2', plan: 'Ultra Veg', phone: '63005 •• 5032' },
    { name: 'Ananya Shah', area: 'Madhapur', address: 'Image Hospital Road', plan: 'Basic Veg', phone: '88975 •• 1173' },
  ]
  const areas = ['All areas', ...Array.from(new Set(deliveries.map((delivery) => delivery.area)))]
  const filtered = deliveries.filter((delivery) => area === 'All areas' || delivery.area === area)
  return <div className="admin-panel"><div className="table-title"><div><h3>Today's delivery list</h3><p>{filtered.length} meal{filtered.length === 1 ? '' : 's'} on the route · Wednesday, October 21</p></div><label className="area-select"><MapPin size={15} /><select value={area} onChange={(event) => setArea(event.target.value)}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="delivery-list">{filtered.map((delivery, index) => <div className="delivery-item" key={delivery.name}><span className="delivery-index">{String(index + 1).padStart(2, '0')}</span><span className="delivery-person"><strong>{delivery.name}</strong><small>{delivery.address} · {delivery.phone}</small></span><span className="delivery-area">{delivery.area}</span><span className="delivery-plan">{delivery.plan}</span><button aria-label={`Mark ${delivery.name} delivered`} className="delivered-button"><Check size={15} /></button></div>)}</div><div className="admin-note">Sample delivery addresses are fictional preview data—not actual customer information.</div></div>
}
