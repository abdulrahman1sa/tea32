import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Camera, Heart, MessageCircle, Plus, Send, Search, Bell, X, Trash2, UserPlus, UserCheck, Smile, Edit3, Reply, Hash, Users, TrendingUp, Image as ImageIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOJI_LIST } from './emojis';

// Check if Supabase is properly configured
const isSupabaseReady = !!supabase;

// --- Helpers ---
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)}د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)}س`;
  return date.toLocaleDateString('ar-EG');
};

const parseContent = (text, onHashtagClick) => {
  if (!text) return '';
  const parts = text.split(/(\s+|:\w+:)/g);
  return parts.map((part, i) => {
    if (part.startsWith(':') && part.endsWith(':')) {
      const emoji = EMOJI_LIST.find(e => e.code === part);
      if (emoji) return <img key={i} src={emoji.url} alt={part} style={{ width: '22px', height: '22px', verticalAlign: 'middle', margin: '0 2px' }} />;
    }
    if (part.startsWith('#')) return <span key={i} onClick={() => onHashtagClick && onHashtagClick(part)} style={{ color: '#8E2B1E', fontWeight: 'bold', cursor: 'pointer' }}>{part}</span>;
    if (part.startsWith('@')) return <span key={i} style={{ color: '#8E2B1E', fontWeight: 'bold', background: 'rgba(142, 43, 30, 0.05)', padding: '0 2px', borderRadius: '4px' }}>{part}</span>;
    return part;
  });
};

const getRank = (idx) => {
  if (idx === 0) return { label: 'عمدة المقهى', color: '#D4AF37' };
  if (idx < 5) return { label: 'ضيف دائم', color: '#8E2B1E' };
  return { label: 'عضو نشط', color: '#666' };
};

// --- Main App ---
function App() {
  const [user, setUser] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [view, setView] = useState('feed');
  const [viewProfileId, setViewProfileId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!isSupabaseReady) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchMyProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchMyProfile(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchMyProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (data) setMyProfile(data);
  };

  useEffect(() => { if (user) fetchPosts(); }, [user, activeTab]);

  const fetchPosts = async () => {
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (activeTab === 'trend') query = query.order('likes_count', { ascending: false });
    const { data } = await query;
    setPosts(data || []);
  };

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (!val.trim() || val.trim().length < 2) { setSearchResults([]); return; }
    const { data, error } = await supabase.from('profiles').select('*').ilike('full_name', `%${val.trim()}%`).limit(10);
    if (error) console.error('Search error:', error);
    setSearchResults(data || []);
  };

  const navigateToProfile = (uid) => {
    if (!uid) return;
    setViewProfileId(uid);
    setView('profile');
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isSupabaseReady) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center', direction: 'rtl' }}>
        <h2 style={{ color: '#8E2B1E' }}>⚠️ خطأ في الإعدادات</h2>
        <p>مفاتيح Supabase غير موجودة.</p>
      </div>
    );
  }

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginPage />;
  if (user && !myProfile) return <ProfileSetup user={user} onComplete={() => fetchMyProfile(user.id)} />;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#FFFCF9', direction: 'rtl', paddingBottom: '90px' }}>
      <BackgroundBlobs />

      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setView('feed'); setViewProfileId(null); }}>
          <img src="/logo.png" style={{ width: '40px' }} alt="Logo" />
          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#2D2424' }}>الجمهورية</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowSearch(true)} className="icon-btn"><Search size={20} /></button>
          <button onClick={() => navigateToProfile(user.id)} className="icon-btn" style={{ padding: 0, border: '2px solid #8E2B1E' }}>
            <img src={myProfile?.avatar_url || `https://ui-avatars.com/api/?name=${myProfile?.full_name}`} style={{ width: '35px', height: '35px', borderRadius: '12px', objectFit: 'cover' }} />
          </button>
        </div>
      </header>

      {view === 'feed' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ padding: '15px', display: 'flex', gap: '10px' }}>
            <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={<Users size={14} />}>الكل</Tab>
            <Tab active={activeTab === 'trend'} onClick={() => setActiveTab('trend')} icon={<TrendingUp size={14} />}>التريند 🔥</Tab>
          </div>
          <main style={{ padding: '0 15px' }}>
            {posts.map(post => <PostCard key={post.id} post={post} currentUser={user} onDeleted={fetchPosts} onProfileClick={navigateToProfile} onLike={fetchPosts} />)}
            {posts.length === 0 && <center style={{ padding: 60, color: '#999' }}>لا توجد منشورات حالياً في الجمهورية... ابدأ أنت! ☕️</center>}
          </main>
        </motion.div>
      ) : (
        <ProfileView profileId={viewProfileId} currentUser={user} onBack={() => setView('feed')} onProfileUpdate={() => fetchMyProfile(user.id)} />
      )}

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 1000, padding: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '25px' }}>
              <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '20px', padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={22} color="#8E2B1E" />
                <input autoFocus placeholder="ابحث عن الأعضاء..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} style={{ background: 'none', border: 'none', flex: 1, outline: 'none', fontSize: '1.2rem' }} />
              </div>
              <button onClick={() => setShowSearch(false)} style={{ background: '#f5f5f5', borderRadius: '50%', padding: '12px', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {searchResults.map(p => (
                <div key={p.id} onClick={() => navigateToProfile(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'white', borderRadius: '20px', border: '1px solid #eee', cursor: 'pointer' }}>
                  <img src={p.avatar_url || `https://ui-avatars.com/api/?name=${p.full_name}`} style={{ width: '55px', height: '55px', borderRadius: '18px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>{p.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.bio || 'لا يوجد نبذة بعد...'}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="fab" onClick={() => setIsUploadOpen(true)}><Plus size={32} /></button>
      <AnimatePresence>
        {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} myProfile={myProfile} onSuccess={() => { fetchPosts(); setIsUploadOpen(false); }} />}
      </AnimatePresence>
    </div>
  );
}

// --- PostCard ---
function PostCard({ post, currentUser, onDeleted, onProfileClick, onLike }) {
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUser?.id === post.user_id;

  useEffect(() => {
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id).then(({ count }) => setCommentCount(count || 0));
  }, [post.id]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    await supabase.rpc('increment_likes', { p_id: post.id });
    onLike();
  };

  const deleteProcess = async () => {
    if (!window.confirm('⚠️ حذف المنشور والتعليقات؟')) return;
    setIsDeleting(true);
    try {
      await supabase.from('comments').delete().eq('post_id', post.id);
      const { data, error } = await supabase.from('posts').delete().eq('id', post.id).select();
      if (!error && data?.length > 0) {
        const fileName = post.image_url.split('/').pop();
        if (fileName && !fileName.includes('ui-avatars')) {
          await supabase.storage.from('tea-moments').remove([fileName]);
        }
        onDeleted();
      } else {
        alert("فشل الحذف. قد لا تملك الصلاحية.");
        setIsDeleting(false);
      }
    } catch (e) {
      alert('حدث خطأ');
      setIsDeleting(false);
    }
  };

  return (
    <motion.div layout animate={{ opacity: isDeleting ? 0.3 : 1 }} className="glass-card" style={{ marginBottom: '25px', borderRadius: '30px', overflow: 'hidden' }}>
      <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onProfileClick(post.user_id)}>
          <img src={`https://ui-avatars.com/api/?name=${post.author_name}&background=8E2B1E&color=fff`} style={{ width: '40px', height: '40px', borderRadius: '15px' }} />
          <div>
            <div style={{ fontWeight: '900', fontSize: '1rem' }}>{post.author_name}</div>
            <div style={{ fontSize: '0.7rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {formatTime(post.created_at)}</div>
          </div>
        </div>
        {isOwner && <button onClick={deleteProcess} disabled={isDeleting} style={{ color: '#ff4d4d', background: 'rgba(255,0,0,0.05)', border: 'none', padding: 10, borderRadius: 12, cursor: 'pointer' }}><Trash2 size={20} /></button>}
      </div>

      <img src={post.image_url} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0, color: '#2D2424' }}>{parseContent(post.caption)}</p>
        <div style={{ display: 'flex', gap: '30px', marginTop: '20px', borderTop: '1px solid #f5f5f5', paddingTop: '15px' }}>
          <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#8E2B1E' : '#666' }}>
            <Heart size={24} fill={liked ? '#8E2B1E' : 'none'} /> <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>{post.likes_count || 0}</span>
          </button>
          <button onClick={() => setShowComments(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
            <MessageCircle size={24} /> <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>{commentCount} رد</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showComments && <CommentsDrawer onClose={() => setShowComments(false)} postId={post.id} />}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Comments Drawer ---
function CommentsDrawer({ onClose, postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { fetchComments(); }, [postId]);

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    setComments(data || []);
  };

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("يجب تسجيل الدخول أولاً"); return; }
    const { data: p } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    await supabase.from('comments').insert([{ post_id: postId, content: text, author_name: p?.full_name || 'عضو', user_id: user.id }]);
    setText('');
    fetchComments();
    setLoading(false);
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={{ position: 'fixed', inset: 0, background: '#f9f9f9', zIndex: 1100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#8E2B1E', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '900', fontSize: '1.2rem' }}>💬 مجلس النقاش</span>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', padding: 8, cursor: 'pointer' }}><X size={24} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, paddingBottom: 160 }}>
        {comments.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', gap: 15, marginBottom: 25 }}>
            <div style={{ width: 55, textAlign: 'center' }}>
              <img src={`https://ui-avatars.com/api/?name=${c.author_name}&background=random`} style={{ width: 45, height: 45, borderRadius: 15 }} />
              <div style={{ fontSize: '0.65rem', color: getRank(i).color, marginTop: 6, fontWeight: 'bold' }}>{getRank(i).label}</div>
            </div>
            <div style={{ flex: 1, background: 'white', padding: 18, borderRadius: '25px 0 25px 25px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#ccc', marginBottom: 10 }}>
                <span>#{i + 1}</span>
                <button onClick={() => { setText(t => t + `@${c.author_name} `); inputRef.current?.focus(); }} style={{ color: '#8E2B1E', fontWeight: '900', background: 'none', border: 'none', cursor: 'pointer' }}>رد</button>
              </div>
              <div style={{ fontSize: '1rem', color: '#333', lineHeight: 1.5 }}>{parseContent(c.content)}</div>
            </div>
          </div>
        ))}
        {comments.length === 0 && <center style={{ padding: 80, color: '#999' }}>لا توجد تعليقات بعد...</center>}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', padding: 25, borderTop: '2px solid #8E2B1E' }}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 15, scrollbarWidth: 'none' }}>
          {EMOJI_LIST.map(e => <button key={e.id} onClick={() => setText(t => t + e.code)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><img src={e.url} style={{ width: 28, height: 28 }} /></button>)}
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)} placeholder="اكتب تعليقك هنا..." style={{ flex: 1, height: 60, border: '1px solid #ddd', borderRadius: 18, padding: 15, resize: 'none', fontSize: '1rem' }} />
          <button onClick={send} disabled={loading} className="btn-primary" style={{ width: 70, borderRadius: 20 }}>{loading ? '...' : <Send size={28} />}</button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Other Components ---
function Tab({ active, onClick, icon, children }) { return (<button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', borderRadius: '18px', background: active ? '#8E2B1E' : 'white', color: active ? 'white' : '#666', fontWeight: 900, fontSize: '0.95rem', border: '1px solid #eee', cursor: 'pointer' }}>{icon} {children}</button>); }
function LoginPage() { return (<div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFCF9' }}><BackgroundBlobs /><div style={{ width: 120, height: 120, background: 'white', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}><img src="/logo.png" style={{ width: 75 }} /></div><button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })} className="btn-primary" style={{ padding: '22px 50px', fontSize: '1.3rem', fontWeight: 900 }}>دخول بـ Google</button></div>); }
function LoadingScreen() { return <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, background: '#FFFCF9' }}> <div className="spinner" style={{ width: 50, height: 50, border: '5px solid #eee', borderTopColor: '#8E2B1E', borderRadius: '50%' }} /> <b>جاري تحضير المقهى... 🍵</b></div>; }
function BackgroundBlobs() { return <div className="bg-blobs"><div className="blob blob-1" /><div className="blob blob-2" /></div>; }
function ProfileSetup({ user, onComplete }) {
  const [name, setName] = useState(user.user_metadata?.full_name || '');
  const handleSave = async () => { if (!name.trim()) return; await supabase.from('profiles').insert([{ id: user.id, full_name: name }]); onComplete(); };
  return (<div style={{ padding: '100px 35px', textAlign: 'center' }}><h2>مرحباً! 👋</h2><input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 20, borderRadius: 25, border: '1.5px solid #ddd', marginTop: 40, fontSize: '1.3rem', textAlign: 'center', fontWeight: 'bold' }} /><button onClick={handleSave} className="btn-primary" style={{ marginTop: 30, width: '100%', padding: 22, borderRadius: 25, fontSize: '1.2rem' }}>ابدأ الآن ✨</button></div>);
}
function UploadModal({ onClose, onSuccess, myProfile }) {
  const [preview, setPreview] = useState(null);
  const [cap, setCap] = useState('');
  const [up, setUp] = useState(false);
  const handle = async () => {
    const file = document.getElementById('upf').files[0];
    if (!file || up) return;
    setUp(true);
    try {
      const fName = `${Date.now()}.jpg`;
      await supabase.storage.from('tea-moments').upload(fName, file);
      const { data: { publicUrl } } = supabase.storage.from('tea-moments').getPublicUrl(fName);
      await supabase.from('posts').insert([{ image_url: publicUrl, caption: cap, author_name: myProfile.full_name, user_id: myProfile.id }]);
      onSuccess();
    } catch (e) { alert('خطأ في النشر'); }
    setUp(false);
  };
  return (<div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 1200, padding: 30, overflowY: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}><h3 style={{ margin: 0 }}>لحظة جديدة 📸</h3><button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', padding: 10 }}><X /></button></div>
    <input type="file" id="upf" hidden onChange={e => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))} />
    <div onClick={() => document.getElementById('upf').click()} style={{ width: '100%', height: 400, background: '#f9f9f9', borderRadius: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', border: '2.5px dashed #ccc', marginBottom: 30 }}>
      {preview ? <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center' }}><ImageIcon size={70} color="#ccc" /><p style={{ color: '#aaa', marginTop: 15 }}>المس هنا لاختيار صورة</p></div>}
    </div>
    <textarea placeholder="اكتب وصفاً..." value={cap} onChange={e => setCap(e.target.value)} style={{ width: '100%', height: 140, padding: 25, borderRadius: 25, border: '1px solid #eee', background: '#fdfdfd', resize: 'none', fontSize: '1.2rem' }} />
    <button onClick={handle} disabled={up || !preview} className="btn-primary" style={{ width: '100%', marginTop: 35, padding: 22, borderRadius: 30, fontSize: '1.3rem', fontWeight: 900 }}>{up ? 'جاري النشر...' : 'انشر اللحظة ✨'}</button>
  </div>);
}

function ProfileView({ profileId, currentUser, onBack, onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const isMe = currentUser.id === profileId;
  useEffect(() => { loadProfile(); }, [profileId]);
  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', profileId).single();
    setProfile(data);
    const { data: p } = await supabase.from('posts').select('*').eq('user_id', profileId).order('created_at', { ascending: false });
    setPosts(p || []);
  };
  if (!profile) return <LoadingScreen />;
  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ height: '240px', background: profile.cover_url ? `url(${profile.cover_url}) center/cover` : 'linear-gradient(135deg, #8E2B1E, #D4AF37)', position: 'relative' }}>
        <button onClick={onBack} style={{ position: 'absolute', top: 25, right: 25, background: 'rgba(0,0,0,0.4)', color: 'white', padding: 12, borderRadius: '50%', border: 'none', cursor: 'pointer', backdropFilter: 'blur(8px)' }}><X size={26} /></button>
      </div>
      <div style={{ padding: '0 30px', marginTop: '-65px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ width: 130, height: 130, borderRadius: 40, border: '7px solid #FFFCF9', overflow: 'hidden', background: 'white' }}>
            <img src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {isMe && <button onClick={() => setIsEditing(true)} style={{ background: '#2D2424', color: 'white', border: 'none', padding: '14px 30px', borderRadius: '18px', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer' }}>تعديل الملف</button>}
        </div>
        <h2 style={{ marginTop: 25, marginBottom: 8, fontSize: '2rem', fontWeight: 900, color: '#2D2424' }}>{profile.full_name}</h2>
        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 30 }}>{profile.bio || 'لا توجد نبذة...'} 🍵</p>
        <div style={{ display: 'flex', gap: '40px', padding: '25px', background: 'white', borderRadius: '30px', border: '1px solid #eee' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontWeight: '900', fontSize: '1.6rem' }}>{posts.length}</div><div style={{ fontSize: '0.9rem', color: '#999' }}>منشور</div></div>
          <div style={{ width: 1, background: '#f0f0f0' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontWeight: '900', fontSize: '1.6rem' }}>0</div><div style={{ fontSize: '0.9rem', color: '#999' }}>متابع</div></div>
        </div>
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {posts.map(p => <img key={p.id} src={p.image_url} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '18px' }} />)}
        </div>
      </div>
      <AnimatePresence>{isEditing && <EditProfileModal profile={profile} onClose={() => setIsEditing(false)} onUpdate={() => { loadProfile(); onProfileUpdate(); }} />}</AnimatePresence>
    </div>
  );
}

function EditProfileModal({ profile, onClose, onUpdate }) {
  const [name, setName] = useState(profile.full_name);
  const [bio, setBio] = useState(profile.bio || '');
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    await supabase.from('profiles').update({ full_name: name, bio }).eq('id', profile.id);
    onUpdate();
    onClose();
  };
  const upload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const fileName = `${profile.id}/${type}-${Date.now()}.jpg`;
      await supabase.storage.from('avatars').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const update = type === 'avatar' ? { avatar_url: publicUrl } : { cover_url: publicUrl };
      await supabase.from('profiles').update(update).eq('id', profile.id);
      onUpdate();
    } catch (err) { alert('فشل الرفع'); }
    setLoading(false);
  };
  const remove = async (type) => {
    if (!window.confirm('حذف الصورة؟')) return;
    setLoading(true);
    try {
      const update = type === 'avatar' ? { avatar_url: null } : { cover_url: null };
      await supabase.from('profiles').update(update).eq('id', profile.id);
      onUpdate();
    } catch (err) { alert('فشل الحذف'); }
    setLoading(false);
  };
  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 1200, padding: 35, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35 }}>
        <h3 style={{ margin: 0 }}>تعديل ملفك ✨</h3>
        <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', padding: 10 }}><X /></button>
      </div>
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><b>الغلاف</b>{profile.cover_url && <button onClick={() => remove('cover')} style={{ color: '#ff4d4d', background: 'none', border: 'none', fontWeight: 'bold' }}>حذف</button>}</div>
        <div onClick={() => document.getElementById('cov').click()} style={{ height: 130, background: '#f9f9f9', borderRadius: 25, position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '2px dashed #eee' }}>
          {profile.cover_url ? <img src={profile.cover_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <center style={{ padding: 50, color: '#bbb' }}>تغيير الغلاف</center>}
        </div>
        <input type="file" id="cov" hidden onChange={e => upload(e, 'cover')} />
      </div>
      <div style={{ marginBottom: 35 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><b>الصورة الشخصية</b>{profile.avatar_url && <button onClick={() => remove('avatar')} style={{ color: '#ff4d4d', background: 'none', border: 'none', fontWeight: 'bold' }}>حذف</button>}</div>
        <img onClick={() => document.getElementById('av').click()} src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}`} style={{ width: 110, height: 110, borderRadius: 35, objectFit: 'cover', cursor: 'pointer', border: '5px solid #f9f9f9' }} />
        <input type="file" id="av" hidden onChange={e => upload(e, 'avatar')} />
      </div>
      <div style={{ marginBottom: 25 }}>
        <label style={{ display: 'block', fontWeight: '900', marginBottom: 10 }}>الاسم</label>
        <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 18, borderRadius: 20, border: '1px solid #eee', background: '#fafafa', fontSize: '1.1rem' }} />
      </div>
      <div style={{ marginBottom: 35 }}>
        <label style={{ display: 'block', fontWeight: '900', marginBottom: 10 }}>النبذة</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ width: '100%', height: 100, padding: 18, borderRadius: 20, border: '1px solid #eee', background: '#fafafa', resize: 'none', fontSize: '1.1rem' }} />
      </div>
      <button onClick={handleUpdate} disabled={loading} className="btn-primary" style={{ width: '100%', padding: 20, borderRadius: 25, fontSize: '1.2rem', fontWeight: 900 }}>{loading ? 'جاري الحفظ...' : 'حفظ التغييرات ✅'}</button>
    </motion.div>
  );
}

export default App;
