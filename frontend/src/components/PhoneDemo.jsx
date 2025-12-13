import React, { useEffect, useState } from "react";
import AppleLogo from "../assets/apple-logo.png";

export default function PhoneDemo() {
  const [stage, setStage] = useState("apple");
  const [number, setNumber] = useState("");
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [time, setTime] = useState("14:30");
  const [signalStrength, setSignalStrength] = useState(4);
  const [activeApp, setActiveApp] = useState("home");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mailItems, setMailItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newEmail, setNewEmail] = useState({ to: "", subject: "", body: "" });
  const [audio] = useState(new Audio("https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"));

  // Initialize with data
  useEffect(() => {
    // Fetch demo photos from Picsum
    const fetchPhotos = async () => {
      try {
        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=4');
        const data = await response.json();
        const fetchedPhotos = data.map((photo, idx) => ({
          id: photo.id,
          url: `https://picsum.photos/id/${photo.id}/300/300`,
          label: `Photo ${idx + 1}`,
          author: photo.author
        }));
        setPhotos(fetchedPhotos);
      } catch (error) {
        // Fallback demo photos
        setPhotos([
          { id: 1, color: "bg-gradient-to-br from-blue-400 to-purple-500", label: "Sunset" },
          { id: 2, color: "bg-gradient-to-br from-green-400 to-blue-500", label: "Nature" },
          { id: 3, color: "bg-gradient-to-br from-yellow-400 to-red-500", label: "City" },
          { id: 4, color: "bg-gradient-to-br from-pink-400 to-red-500", label: "Beach" },
        ]);
      }
    };

    fetchPhotos();

    // Initial messages
    setMessages([
      { id: 1, sender: "John Doe", message: "Hey, are we meeting today?", time: "10:30 AM", read: true },
      { id: 2, sender: "Sarah Smith", message: "Don't forget the party tonight!", time: "Yesterday", read: true },
      { id: 3, sender: "Alex Johnson", message: "Meeting rescheduled to 3 PM", time: "2 days ago", read: false },
    ]);

    // Initial emails
    setMailItems([
      { id: 1, from: "GitHub", subject: "New repository created", time: "2 hours ago", read: false },
      { id: 2, from: "Twitter", subject: "New follower alert", time: "5 hours ago", read: true },
      { id: 3, from: "Amazon", subject: "Your order has been shipped", time: "1 day ago", read: true },
    ]);
  }, []);

  // Real-time updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    // Simulate battery drain slowly
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => prev > 10 ? prev - 0.1 : prev);
    }, 120000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(batteryInterval);
    };
  }, []);

  // Start animation
  useEffect(() => {
    setTimeout(() => setStage("black"), 3000);
    setTimeout(() => {
      setStage("home");
      setActiveApp("home");
    }, 3500);
  }, []);

  // Music control
  useEffect(() => {
    if (musicPlaying) {
      audio.play().catch(e => console.log("Audio play failed:", e));
    } else {
      audio.pause();
    }
  }, [musicPlaying, audio]);

  // Phone functions
  const press = (val) => {
    if (number.length >= 15) return;
    setNumber(prev => prev + val);
  };

  const handlePhoneClick = () => {
    setActiveApp("phoneOpening");
    setStage("phoneOpening");
    setTimeout(() => {
      setActiveApp("dial");
      setStage("dial");
    }, 800);
  };

  const handleBackToHome = () => {
    setStage("home");
    setActiveApp("home");
  };

  const handleAppClick = (appName) => {
    if (appName === "phone") {
      handlePhoneClick();
    } else {
      setActiveApp(appName);
      setStage(appName);
    }
  };

  // Real search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Using DuckDuckGo instant answer API
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1`);
      const data = await response.json();
      
      if (data.AbstractText) {
        setSearchResults([
          { 
            id: 1, 
            title: data.Heading || searchQuery, 
            snippet: data.AbstractText,
            url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`
          }
        ]);
      } else {
        // Fallback mock results
        setSearchResults([
          { id: 1, title: `${searchQuery} - Search Results`, url: `https://google.com/search?q=${encodeURIComponent(searchQuery)}`, snippet: "Search results for your query" },
          { id: 2, title: "Wikipedia", url: `https://wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`, snippet: "Wikipedia article about your search" },
          { id: 3, title: "YouTube", url: `https://youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, snippet: "Videos related to your search" },
        ]);
      }
    } catch (error) {
      // Mock results on error
      setSearchResults([
        { id: 1, title: "React Documentation", url: "https://reactjs.org", snippet: "A JavaScript library for building user interfaces" },
        { id: 2, title: "Tailwind CSS", url: "https://tailwindcss.com", snippet: "A utility-first CSS framework" },
        { id: 3, title: "Node.js", url: "https://nodejs.org", snippet: "JavaScript runtime built on Chrome's V8 engine" },
      ]);
    }
    
    setIsSearching(false);
  };

  const handleTakePhoto = () => {
    setCameraActive(true);
    setTimeout(() => {
      const newPhoto = {
        id: photos.length + 1,
        url: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/300/300`,
        label: `Photo ${photos.length + 1}`,
      };
      setPhotos(prev => [newPhoto, ...prev]);
      setCameraActive(false);
    }, 1000);
  };

  const handlePlayMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      message: newMessage,
      time: "Just now",
      read: true
    };
    setMessages(prev => [newMsg, ...prev]);
    setNewMessage("");
  };

  const handleSendEmail = () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.body) return;
    
    const newMail = {
      id: mailItems.length + 1,
      from: "You",
      subject: newEmail.subject,
      time: "Just now",
      read: false,
      to: newEmail.to,
      body: newEmail.body
    };
    setMailItems(prev => [newMail, ...prev]);
    setNewEmail({ to: "", subject: "", body: "" });
  };

  // Components
  const BatteryIcon = () => {
    const percentage = Math.round(batteryLevel);
    let color = "bg-green-500";
    if (percentage < 20) color = "bg-red-500";
    else if (percentage < 50) color = "bg-yellow-500";
    
    return (
      <div className="flex items-center gap-1.5">
        <div className="text-[11px] font-semibold text-white">{percentage}%</div>
        <div className="relative w-[22px] h-3.5 border border-white/80 rounded-[3px] flex items-center p-[1.5px] bg-black/30">
          <div 
            className={`h-full ${color} rounded-[1.5px]`} 
            style={{ width: `${Math.max(percentage, 3)}%` }} 
          />
          <div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[2.5px] h-[10px] bg-white/80 rounded-[1px]" />
        </div>
      </div>
    );
  };

  const NetworkBars = () => {
    const bars = [];
    for (let i = 1; i <= 4; i++) {
      bars.push(
        <div
          key={i}
          className={`w-[3px] ${i <= signalStrength ? 'bg-white' : 'bg-white/30'} rounded-[0.5px]`}
          style={{ height: `${i * 3.5}px` }}
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">{bars}</div>
        <div className="text-[11px] font-semibold text-white ml-1">5G</div>
      </div>
    );
  };

  const DialKey = ({ v, sub }) => (
    <button
      onClick={() => press(v)}
      className="w-[68px] h-[68px] rounded-full bg-[#2c2c2e] active:bg-[#3a3a3c] flex flex-col items-center justify-center transition-all duration-150 active:scale-95 hover:bg-[#363638]"
    >
      <div className="text-[28px] font-light text-white">{v}</div>
      {sub && <div className="text-[9px] text-gray-400 mt-[-2px] tracking-widest font-medium">{sub}</div>}
    </button>
  );

  const dialKeys = [
    { key: '1', sub: '' },
    { key: '2', sub: 'ABC' },
    { key: '3', sub: 'DEF' },
    { key: '4', sub: 'GHI' },
    { key: '5', sub: 'JKL' },
    { key: '6', sub: 'MNO' },
    { key: '7', sub: 'PQRS' },
    { key: '8', sub: 'TUV' },
    { key: '9', sub: 'WXYZ' },
    { key: '*', sub: '' },
    { key: '0', sub: '+' },
    { key: '#', sub: '' },
  ];

  const AppIcon = ({ icon, label, appName, className = "" }) => (
    <div 
      className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
      onClick={() => handleAppClick(appName)}
    >
      <div 
        className={`w-[70px] h-[70px] rounded-[20px] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md flex items-center justify-center shadow-lg ${className}`}
      >
        {icon}
      </div>
      <div className="text-white text-[11px] font-medium mt-2 text-center shadow-sm">{label}</div>
    </div>
  );

  // App icons - Added Maps icon
  const AppIcons = {
    Phone: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
    Messages: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
      </svg>
    ),
    Mail: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    Safari: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l5-5-5-5v10z"/>
      </svg>
    ),
    Maps: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
      </svg>
    ),
    Photos: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
    Camera: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
      </svg>
    ),
    Settings: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    ),
    Music: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    ),
  };

  // App screens
  const renderAppScreen = (appName) => {
    switch(appName) {
      case 'messages':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-900 animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Messages</div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 ${!msg.read ? 'border-l-4 border-blue-400' : ''}`}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-white font-medium">{msg.sender}</div>
                      <div className="text-white/60 text-xs">{msg.time}</div>
                    </div>
                    <div className="text-white/80 text-sm">{msg.message}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/20 text-white placeholder-white/60 px-4 py-3 rounded-full outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-5 py-3 rounded-full font-medium active:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mail':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-900 animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Mail</div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {mailItems.map((mail) => (
                  <div key={mail.id} className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 ${!mail.read ? 'border-l-4 border-red-400' : ''}`}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-white font-medium">{mail.from}</div>
                      <div className="text-white/60 text-xs">{mail.time}</div>
                    </div>
                    <div className="text-white/80 text-sm">{mail.subject}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pb-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newEmail.to}
                    onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                    placeholder="To"
                    className="w-full bg-white/20 text-white placeholder-white/60 px-4 py-3 rounded-full outline-none"
                  />
                  <input
                    type="text"
                    value={newEmail.subject}
                    onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                    placeholder="Subject"
                    className="w-full bg-white/20 text-white placeholder-white/60 px-4 py-3 rounded-full outline-none"
                  />
                  <textarea
                    value={newEmail.body}
                    onChange={(e) => setNewEmail({...newEmail, body: e.target.value})}
                    placeholder="Message"
                    className="w-full bg-white/20 text-white placeholder-white/60 px-4 py-3 rounded-xl outline-none h-32"
                  />
                  <button 
                    onClick={handleSendEmail}
                    className="w-full bg-white/30 text-white py-3 rounded-full font-medium active:bg-white/40"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'safari':
        return (
          <div className="absolute inset-0 bg-white animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <button onClick={handleBackToHome} className="text-gray-600 text-xl mr-3 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">←</button>
                <div className="text-black text-xl font-semibold">Safari</div>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search web..."
                  className="flex-1 bg-gray-100 text-black placeholder-gray-500 px-4 py-3 rounded-full outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-blue-500 text-white px-5 py-3 rounded-full font-medium active:bg-blue-600 disabled:opacity-50"
                >
                  {isSearching ? "..." : "Go"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pb-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map(result => (
                      <a 
                        key={result.id}
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors border border-gray-200"
                      >
                        <div className="text-blue-600 font-medium text-lg">{result.title}</div>
                        <div className="text-gray-500 text-sm truncate">{result.url}</div>
                        <div className="text-gray-700 text-sm mt-2">{result.snippet}</div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center mt-8">
                    {searchQuery ? "No results found" : "Enter a search term above"}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'maps':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-900 animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col items-center justify-center">
              <div className="flex items-center mb-4 w-full">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Maps</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center w-full max-w-xs">
                <div className="text-white text-6xl mb-4">🗺️</div>
                <div className="text-white text-xl mb-4">Interactive Maps</div>
                <div className="text-white/80 mb-6">
                  Explore locations with interactive map functionality
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-white/30 text-white py-3 rounded-xl font-medium active:bg-white/40">
                    Search Location
                  </button>
                  <button className="w-full bg-white/30 text-white py-3 rounded-xl font-medium active:bg-white/40">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="absolute inset-0 bg-black animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Photos</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="rounded-2xl overflow-hidden aspect-square relative group">
                    {photo.url ? (
                      <img 
                        src={photo.url} 
                        alt={photo.label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `
                            <div class="w-full h-full ${photo.color || 'bg-gradient-to-br from-blue-400 to-purple-500'} flex items-center justify-center">
                              <div class="text-white font-medium text-center p-2">${photo.label}</div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full ${photo.color} flex items-center justify-center`}>
                        <div className="text-white font-medium text-center p-2">{photo.label}</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white/80 text-black px-4 py-2 rounded-lg font-medium">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="absolute inset-0 bg-black animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col items-center justify-center">
              <div className="flex items-center mb-4 w-full">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Camera</div>
              </div>
              
              <div className="relative w-72 h-72 rounded-3xl overflow-hidden border-4 border-white/30 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  {cameraActive ? (
                    <div className="animate-pulse">
                      <div className="text-white text-5xl">📸</div>
                    </div>
                  ) : (
                    <div className="text-white text-6xl">📷</div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleTakePhoto}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-95 transition-transform mb-4"
              >
                <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-800"></div>
              </button>
              
              <div className="text-gray-400 text-center text-lg">
                {cameraActive ? "Capturing photo..." : "Tap to take photo"}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Settings</div>
              </div>
              
              <div className="space-y-2 flex-1 overflow-y-auto pb-4">
                {[
                  { icon: "📶", label: "Wi-Fi", value: "Connected", color: "bg-blue-500/20" },
                  { icon: "🔋", label: "Battery", value: `${Math.round(batteryLevel)}%`, color: "bg-green-500/20" },
                  { icon: "🔔", label: "Notifications", value: "Enabled", color: "bg-red-500/20" },
                  { icon: "🌙", label: "Display & Brightness", value: "Auto", color: "bg-purple-500/20" },
                  { icon: "🔊", label: "Sounds & Haptics", value: "Default", color: "bg-yellow-500/20" },
                  { icon: "🔒", label: "Privacy & Security", value: "Protected", color: "bg-gray-500/20" },
                  { icon: "📱", label: "General", value: "iPhone", color: "bg-gray-500/20" },
                  { icon: "🔄", label: "Software Update", value: "Up to date", color: "bg-green-500/20" },
                ].map((setting, idx) => (
                  <div key={idx} className={`${setting.color} backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{setting.icon}</div>
                      <div>
                        <div className="text-white text-lg">{setting.label}</div>
                        <div className="text-white/60 text-sm">{setting.value}</div>
                      </div>
                    </div>
                    <div className="text-white/60 text-2xl">›</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-pink-900 to-purple-900 animate-slideUp">
            <div className="pt-12 px-4 h-full flex flex-col items-center justify-center">
              <div className="flex items-center mb-4 w-full">
                <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                <div className="text-white text-xl font-semibold">Music</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center w-full max-w-sm">
                <div className="text-white text-7xl mb-6">🎵</div>
                <div className="text-white text-2xl mb-2">{musicPlaying ? "Now Playing" : "Music Player"}</div>
                <div className="text-white/90 text-xl mb-1">Tech House Vibes</div>
                <div className="text-white/60 text-lg mb-8">Mixkit</div>
                
                <div className="flex items-end justify-center gap-2 h-16 mb-8">
                  {[3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3].map((height, idx) => (
                    <div 
                      key={idx}
                      className={`w-3 rounded-full ${musicPlaying ? 'bg-pink-400 animate-bounce' : 'bg-white/40'}`}
                      style={{ 
                        height: `${height}px`,
                        animationDelay: `${idx * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-center items-center gap-8">
                  <button className="text-white text-3xl p-3 rounded-full bg-white/20">⏮️</button>
                  <button 
                    onClick={handlePlayMusic}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl shadow-2xl active:scale-95 transition-transform"
                  >
                    {musicPlaying ? "⏸️" : "▶️"}
                  </button>
                  <button className="text-white text-3xl p-3 rounded-full bg-white/20">⏭️</button>
                </div>
                
                <div className="mt-6 text-white/70">
                  {musicPlaying ? "Playing real audio..." : "Tap play to start music"}
                </div>
              </div>
            </div>
          </div>
        );

      case 'phoneOpening':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-900 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-6xl animate-bounce">📞</div>
            </div>
          </div>
        );

      case 'dial':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 animate-slideUp">
            <div className="flex flex-col h-full">
              <div className="pt-12 px-6">
                <div className="flex items-center mb-6">
                  <button onClick={handleBackToHome} className="text-white text-xl mr-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">←</button>
                  <div className="text-white text-xl font-semibold">Phone</div>
                </div>
                
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="text-white text-5xl font-light tracking-widest mb-2 min-h-[70px] flex items-center">
                    {number || " "}
                  </div>
                  <div className="text-gray-400 text-sm">Tap the keypad to dial</div>
                </div>
              </div>
              
              <div className="pb-12 px-6 flex-1 flex flex-col justify-end">
                <div className="grid grid-cols-3 gap-4">
                  {dialKeys.map((key) => (
                    <DialKey key={key.key} v={key.key} sub={key.sub} />
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center gap-8">
                  <button className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg active:scale-95">
                    <div className="text-white text-4xl">✆</div>
                  </button>
                  <button 
                    onClick={() => setNumber("")}
                    className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95"
                  >
                    <div className="text-white text-4xl">⌫</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative w-[390px] h-[844px] bg-gray-950 rounded-[50px] border-[12px] border-gray-800 shadow-2xl overflow-hidden transform scale-95">
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-50 flex items-center justify-between px-8 pt-1">
            <div className="text-white text-[15px] font-semibold">{time}</div>
            <div className="flex items-center gap-4">
              <NetworkBars />
              <BatteryIcon />
            </div>
          </div>

          {/* Screen Content */}
          <div className="absolute inset-0">
            
            {/* Apple Logo Stage */}
            {stage === "apple" && (
              <div className="absolute inset-0 bg-black flex items-center justify-center animate-fadeIn">
                <img src={AppleLogo} alt="Apple" className="w-40 h-40 animate-pulse" />
              </div>
            )}

            {/* Black Stage */}
            {stage === "black" && (
              <div className="absolute inset-0 bg-black animate-fadeOut" />
            )}

            {/* Home Screen */}
            {stage === "home" && (
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 to-purple-900/90 backdrop-blur-sm pt-12 pb-24 px-6 animate-fadeIn">
                <div className="grid grid-cols-4 gap-5 mt-6">
                  <AppIcon 
                    icon={<AppIcons.Phone />} 
                    label="Phone" 
                    appName="phone"
                    className="bg-gradient-to-br from-green-500 to-green-600"
                  />
                  <AppIcon 
                    icon={<AppIcons.Messages />} 
                    label="Messages" 
                    appName="messages"
                    className="bg-gradient-to-br from-green-500 to-blue-500"
                  />
                  <AppIcon 
                    icon={<AppIcons.Mail />} 
                    label="Mail" 
                    appName="mail"
                    className="bg-gradient-to-br from-blue-500 to-purple-500"
                  />
                  <AppIcon 
                    icon={<AppIcons.Safari />} 
                    label="Safari" 
                    appName="safari"
                    className="bg-gradient-to-br from-blue-400 to-cyan-500"
                  />
                  <AppIcon 
                    icon={<AppIcons.Maps />} 
                    label="Maps" 
                    appName="maps"
                    className="bg-gradient-to-br from-green-400 to-blue-500"
                  />
                  <AppIcon 
                    icon={<AppIcons.Photos />} 
                    label="Photos" 
                    appName="photos"
                    className="bg-gradient-to-br from-purple-400 to-pink-500"
                  />
                  <AppIcon 
                    icon={<AppIcons.Camera />} 
                    label="Camera" 
                    appName="camera"
                    className="bg-gradient-to-br from-gray-700 to-gray-900"
                  />
                  <AppIcon 
                    icon={<AppIcons.Settings />} 
                    label="Settings" 
                    appName="settings"
                    className="bg-gradient-to-br from-gray-600 to-gray-800"
                  />
                  <AppIcon 
                    icon={<AppIcons.Music />} 
                    label="Music" 
                    appName="music"
                    className="bg-gradient-to-br from-pink-500 to-red-500"
                  />
                </div>
              </div>
            )}

            {/* App Screens */}
            {['messages', 'mail', 'safari', 'maps', 'photos', 'camera', 'settings', 'music', 'phoneOpening', 'dial'].includes(stage) && (
              renderAppScreen(stage)
            )}

          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
          
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6  rounded-full"></div>
        </div>
      </div>
    </div>
  );
}