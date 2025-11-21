
"use client";

import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { motion } from "framer-motion";

interface ButtonData {
  label: string;
  style: string;
  url: string;
  emoji: string;
  row: number;
  disabled: boolean;
}

interface EmbedData {
  content: string;
  color: string;
  url: string;
  title: string;
  description: string;
  authorName: string;
  authorIcon: string;
  authorUrl: string;
  thumbnailUrl: string;
  imageUrl: string;
  footerText: string;
  footerIcon: string;
  timestamp: boolean;
  deleteAfter: string;
  buttons: ButtonData[];
}

export default function EmbedBuilder() {
  const [isDark, setIsDark] = useState(true);
  const [embedData, setEmbedData] = useState<EmbedData>({
    content: "",
    color: "#2F3136",
    url: "",
    title: "",
    description: "",
    authorName: "",
    authorIcon: "",
    authorUrl: "",
    thumbnailUrl: "",
    imageUrl: "",
    footerText: "",
    footerIcon: "",
    timestamp: false,
    deleteAfter: "",
    buttons: [],
  });
  const [generatedScript, setGeneratedScript] = useState("");
  const [botInfo, setBotInfo] = useState({ name: "Eris Bot", avatar: "/eris-logo.png" });

  // Load site config
  useEffect(() => {
    fetch("/siteconfig.json")
      .then((res) => res.json())
      .then((config) => {
        if (config.botName) setBotInfo((prev) => ({ ...prev, name: config.botName }));
        if (config.botLogo) setBotInfo((prev) => ({ ...prev, avatar: config.botLogo }));
      })
      .catch(() => {});
  }, []);

  // Generate script whenever embedData changes
  useEffect(() => {
    generateScript();
  }, [embedData]);

  const generateScript = () => {
    const parts: string[] = [];

    if (embedData.content) {
      parts.push(`{content: ${embedData.content.replace(/\n/g, '\\n')}}`);
    }

    // Always include embed marker
    parts.push("$v{embed}");

    if (embedData.color) {
      parts.push(`$v{color: ${embedData.color}}`);
    }

    if (embedData.title) {
      parts.push(`$v{title: ${embedData.title.replace(/\n/g, '\\n')}}`);
    }

    if (embedData.description) {
      parts.push(`$v{description: ${embedData.description.replace(/\n/g, '\\n')}}`);
    }

    if (embedData.timestamp) {
      parts.push("$v{timestamp}");
    }

    if (embedData.authorName) {
      parts.push(`$v{author: name: ${embedData.authorName.replace(/\n/g, '\\n')} && icon: ${embedData.authorIcon || ""}}`);
    }

    if (embedData.thumbnailUrl) {
      parts.push(`$v{thumbnail: ${embedData.thumbnailUrl}}`);
    }

    if (embedData.imageUrl) {
      parts.push(`$v{image: ${embedData.imageUrl}}`);
    }

    if (embedData.footerText) {
      parts.push(`$v{footer: text: ${embedData.footerText.replace(/\n/g, '\\n')} && icon: ${embedData.footerIcon || ""}}`);
    }

    // Add buttons
    if (embedData.buttons && embedData.buttons.length > 0) {
      parts.push("$v{buttons}");
      embedData.buttons.forEach((button) => {
        const buttonParts: string[] = [];
        if (button.label) buttonParts.push(`label=${button.label.replace(/\n/g, '\\n')}`);
        if (button.style) buttonParts.push(`style=${button.style}`);
        if (button.url) buttonParts.push(`url=${button.url}`);
        if (button.emoji) buttonParts.push(`emoji=${button.emoji}`);
        if (button.row !== undefined) buttonParts.push(`row=${button.row}`);
        if (button.disabled) buttonParts.push(`disabled=${button.disabled}`);
        
        if (buttonParts.length > 0) {
          parts.push(`$v{button: ${buttonParts.join(" && ")}}`);
        }
      });
    }

    setGeneratedScript(parts.join(""));
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript);
  };

  const importScript = (script: string) => {
    // Parse the script and update embedData
    const contentMatch = script.match(/\{content:\s*([^}]+)\}/);
    const colorMatch = script.match(/\{color:\s*([^}]+)\}/);
    const titleMatch = script.match(/\{title:\s*([^}]+)\}/);
    const descMatch = script.match(/\{description:\s*([^}]+)\}/);
    const authorMatch = script.match(/\{author:\s*name:\s*([^&]+)&&\s*icon:\s*([^}]+)\}/);
    const thumbMatch = script.match(/\{thumbnail:\s*([^}]+)\}/);
    const imageMatch = script.match(/\{image:\s*([^}]+)\}/);
    const footerMatch = script.match(/\{footer:\s*text:\s*([^&]+)&&\s*icon:\s*([^}]+)\}/);

    // Parse buttons
    const buttons: ButtonData[] = [];
    if (script.includes("{buttons}")) {
      const buttonPattern = /\{button:\s*([^}]+)\}/g;
      let buttonMatch;
      while ((buttonMatch = buttonPattern.exec(script)) !== null) {
        const buttonStr = buttonMatch[1];
        const button: ButtonData = { label: "", style: "secondary", url: "", emoji: "", row: 0, disabled: false };
        
        const properties = buttonStr.split("&&");
        properties.forEach((prop) => {
          const [key, value] = prop.split("=").map((s) => s.trim());
          if (key === "label") button.label = value.replace(/\\n/g, '\n');
          else if (key === "style") button.style = value;
          else if (key === "url") button.url = value;
          else if (key === "emoji") button.emoji = value;
          else if (key === "row") button.row = parseInt(value) || 0;
          else if (key === "disabled") button.disabled = value === "true";
        });
        
        if (button.label) buttons.push(button);
      }
    }

    setEmbedData({
      content: contentMatch ? contentMatch[1].trim().replace(/\\n/g, '\n') : "",
      color: colorMatch ? colorMatch[1].trim() : "#2F3136",
      url: "",
      title: titleMatch ? titleMatch[1].trim().replace(/\\n/g, '\n') : "",
      description: descMatch ? descMatch[1].trim().replace(/\\n/g, '\n') : "",
      authorName: authorMatch ? authorMatch[1].trim().replace(/\\n/g, '\n') : "",
      authorIcon: authorMatch ? authorMatch[2].trim() : "",
      authorUrl: "",
      thumbnailUrl: thumbMatch ? thumbMatch[1].trim() : "",
      imageUrl: imageMatch ? imageMatch[1].trim() : "",
      footerText: footerMatch ? footerMatch[1].trim().replace(/\\n/g, '\n') : "",
      footerIcon: footerMatch ? footerMatch[2].trim() : "",
      timestamp: script.includes("{timestamp}"),
      deleteAfter: "",
      buttons: buttons,
    });
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="max-w-[1800px] mx-auto px-6 py-12">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-8"
        >
          Embed Builder
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Preview */}
          <div className="space-y-6">
            <div className={`rounded-xl p-6 ${isDark ? "bg-gray-900/50 border border-white/10" : "bg-gray-100/50 border border-black/10"}`}>
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <p className="text-sm text-gray-500 mb-4">Live preview of your embed message</p>

              {/* Message Preview */}
              <div className={`rounded-lg p-4 ${isDark ? "bg-[#36393f]" : "bg-white border border-gray-200"}`}>
                {/* Bot Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img src={botInfo.avatar} alt={botInfo.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold text-sm">{botInfo.name}</div>
                    <div className="text-xs text-gray-400">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                {embedData.content && (
                  <div 
                    className="mb-2 markdown-content whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: embedData.content
                        .split('\n')
                        .map(line => {
                          // Headers
                          if (line.startsWith('### ')) return `<h3 class="text-base font-bold">${line.slice(4)}</h3>`;
                          if (line.startsWith('## ')) return `<h2 class="text-lg font-bold">${line.slice(3)}</h2>`;
                          if (line.startsWith('# ')) return `<h1 class="text-xl font-bold">${line.slice(2)}</h1>`;
                          // Quote
                          if (line.startsWith('> ')) return `<div class="border-l-4 border-gray-400 pl-3 text-gray-300">${line.slice(2)}</div>`;
                          // Subtext
                          if (line.startsWith('-# ')) return `<div class="text-xs text-gray-400">${line.slice(3)}</div>`;
                          return line;
                        })
                        .join('<br />')
                        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                        .replace(/__(.+?)__/g, '<u>$1</u>')
                        .replace(/~~(.+?)~~/g, '<del>$1</del>')
                        .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-black/20">$1</code>')
                    }}
                  />
                )}

                {/* Embed */}
                <div
                  className="rounded border-l-4 p-4 space-y-3"
                  style={{
                    borderColor: embedData.color || "#2F3136",
                    backgroundColor: isDark ? "#2f3136" : "#f2f3f5",
                  }}
                >
                  {/* Author */}
                  {embedData.authorName && (
                    <div className="flex items-center gap-2">
                      {embedData.authorIcon && (
                        <img src={embedData.authorIcon} alt="" className="w-6 h-6 rounded-full" />
                      )}
                      <span 
                        className="text-sm font-semibold markdown-content"
                        dangerouslySetInnerHTML={{
                          __html: embedData.authorName
                            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
                            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.+?)\*/g, '<em>$1</em>')
                            .replace(/__(.+?)__/g, '<u>$1</u>')
                            .replace(/~~(.+?)~~/g, '<del>$1</del>')
                            .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-black/20">$1</code>')
                        }}
                      />
                    </div>
                  )}

                  {/* Title */}
                  {embedData.title && (
                    <div 
                      className="text-lg font-bold markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: embedData.title
                          .split('\n')
                          .map(line => {
                            if (line.startsWith('### ')) return `<span class="text-base font-bold">${line.slice(4)}</span>`;
                            if (line.startsWith('## ')) return `<span class="text-lg font-bold">${line.slice(3)}</span>`;
                            if (line.startsWith('# ')) return `<span class="text-xl font-bold">${line.slice(2)}</span>`;
                            if (line.startsWith('> ')) return `<span class="border-l-4 border-gray-400 pl-3 text-gray-300">${line.slice(2)}</span>`;
                            if (line.startsWith('-# ')) return `<span class="text-xs text-gray-400">${line.slice(3)}</span>`;
                            return line;
                          })
                          .join('<br />')
                          .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                          .replace(/__(.+?)__/g, '<u>$1</u>')
                          .replace(/~~(.+?)~~/g, '<del>$1</del>')
                          .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-black/20">$1</code>')
                      }}
                    />
                  )}

                  {/* Description */}
                  {embedData.description && (
                    <div 
                      className="text-sm whitespace-pre-wrap markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: embedData.description
                          .split('\n')
                          .map(line => {
                            if (line.startsWith('### ')) return `<h3 class="text-base font-bold">${line.slice(4)}</h3>`;
                            if (line.startsWith('## ')) return `<h2 class="text-lg font-bold">${line.slice(3)}</h2>`;
                            if (line.startsWith('# ')) return `<h1 class="text-xl font-bold">${line.slice(2)}</h1>`;
                            if (line.startsWith('> ')) return `<div class="border-l-4 border-gray-400 pl-3 text-gray-300">${line.slice(2)}</div>`;
                            if (line.startsWith('-# ')) return `<div class="text-xs text-gray-400">${line.slice(3)}</div>`;
                            return line;
                          })
                          .join('<br />')
                          .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em>$1</em>')
                          .replace(/__(.+?)__/g, '<u>$1</u>')
                          .replace(/~~(.+?)~~/g, '<del>$1</del>')
                          .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-black/20">$1</code>')
                      }}
                    />
                  )}

                  {/* Thumbnail */}
                  {embedData.thumbnailUrl && (
                    <img src={embedData.thumbnailUrl} alt="" className="max-w-[80px] rounded ml-auto" />
                  )}

                  {/* Image */}
                  {embedData.imageUrl && <img src={embedData.imageUrl} alt="" className="max-w-full rounded" />}

                  {/* Footer */}
                  {(embedData.footerText || embedData.timestamp) && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                      {embedData.footerIcon && (
                        <img src={embedData.footerIcon} alt="" className="w-5 h-5 rounded-full" />
                      )}
                      {embedData.footerText && (
                        <span
                          className="markdown-content"
                          dangerouslySetInnerHTML={{
                            __html: embedData.footerText
                              .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.+?)\*/g, '<em>$1</em>')
                              .replace(/__(.+?)__/g, '<u>$1</u>')
                              .replace(/~~(.+?)~~/g, '<del>$1</del>')
                              .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-black/20">$1</code>')
                          }}
                        />
                      )}
                      {embedData.timestamp && (
                        <>
                          {embedData.footerText && <span>•</span>}
                          <span>{new Date().toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                {embedData.buttons && embedData.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {embedData.buttons.map((button, index) => {
                      const buttonStyle = button.style === 'link' 
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : button.style === 'primary' || button.style === 'blurple'
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : button.style === 'success' || button.style === 'green'
                        ? 'bg-green-600 hover:bg-green-700'
                        : button.style === 'danger' || button.style === 'red' || button.style === 'error'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-600 hover:bg-gray-700';

                      return (
                        <button
                          key={index}
                          disabled={button.style !== 'link'}
                          className={`px-4 py-2 rounded text-sm font-medium text-white ${buttonStyle} ${
                            button.style !== 'link' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          } flex items-center gap-1`}
                          onClick={button.style === 'link' && button.url ? () => window.open(button.url, '_blank') : undefined}
                        >
                          {button.emoji && <span>{button.emoji}</span>}
                          <span>{button.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Generated Script */}
            <div className={`rounded-xl p-6 ${isDark ? "bg-gray-900/50 border border-white/10" : "bg-gray-100/50 border border-black/10"}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Script</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyScript}
                    className={`px-4 py-2 rounded-lg text-sm ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}
                  >
                    Copy Script
                  </button>
                </div>
              </div>
              <div className={`rounded-lg p-4 font-mono text-xs break-all ${isDark ? "bg-black/50" : "bg-white"}`}>
                {generatedScript || "Configure your embed to generate a script..."}
              </div>
            </div>
          </div>

          {/* Right Side - Settings */}
          <div className={`rounded-xl p-6 ${isDark ? "bg-gray-900/50 border border-white/10" : "bg-gray-100/50 border border-black/10"} h-fit`}>
            <h2 className="text-xl font-semibold mb-6">Embed Settings</h2>

            <div className="space-y-6">
              {/* Basic Settings */}
              <div>
                <h3 className="font-semibold mb-3">Basic Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={embedData.color}
                        onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={embedData.color}
                        onChange={(e) => setEmbedData({ ...embedData, color: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Title</label>
                    <input
                      type="text"
                      value={embedData.title}
                      onChange={(e) => setEmbedData({ ...embedData, title: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                      placeholder="Enter embed title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                      value={embedData.description}
                      onChange={(e) => setEmbedData({ ...embedData, description: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg h-24 ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                      placeholder="Enter embed description"
                    />
                  </div>
                </div>
              </div>

              {/* Author */}
              <div>
                <h3 className="font-semibold mb-3">Author</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={embedData.authorName}
                    onChange={(e) => setEmbedData({ ...embedData, authorName: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                    placeholder="Author Name"
                  />
                  <input
                    type="text"
                    value={embedData.authorIcon}
                    onChange={(e) => setEmbedData({ ...embedData, authorIcon: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                    placeholder="Author Icon URL"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="font-semibold mb-3">Images</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={embedData.thumbnailUrl}
                    onChange={(e) => setEmbedData({ ...embedData, thumbnailUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                    placeholder="Thumbnail URL"
                  />
                  <input
                    type="text"
                    value={embedData.imageUrl}
                    onChange={(e) => setEmbedData({ ...embedData, imageUrl: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                    placeholder="Image URL"
                  />
                </div>
              </div>

              {/* Footer */}
              <div>
                <h3 className="font-semibold mb-3">Footer</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={embedData.footerText}
                    onChange={(e) => setEmbedData({ ...embedData, footerText: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                    placeholder="Footer Text"
                  />
                  <input
                    type="text"
                    value={embedData.footerIcon}
                    onChange={(e) => setEmbedData({ ...embedData, footerIcon: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                    placeholder="Footer Icon URL"
                  />
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <h3 className="font-semibold mb-3">Additional Options</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={embedData.timestamp}
                    onChange={(e) => setEmbedData({ ...embedData, timestamp: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Include Timestamp</span>
                </label>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="font-semibold mb-3">Message Content</h3>
                <textarea
                  value={embedData.content}
                  onChange={(e) => setEmbedData({ ...embedData, content: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg h-20 ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                  placeholder="Message content (outside embed)"
                />
              </div>

              {/* Buttons */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Buttons</h3>
                  <button
                    onClick={() => {
                      if (embedData.buttons.length < 25) {
                        setEmbedData({
                          ...embedData,
                          buttons: [...embedData.buttons, { label: "", style: "secondary", url: "", emoji: "", row: 0, disabled: false }]
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"}`}
                  >
                    Add Button
                  </button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {embedData.buttons.map((button, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDark ? "bg-black/30" : "bg-gray-100"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Button {index + 1}</span>
                        <button
                          onClick={() => {
                            const newButtons = embedData.buttons.filter((_, i) => i !== index);
                            setEmbedData({ ...embedData, buttons: newButtons });
                          }}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={button.label}
                          onChange={(e) => {
                            const newButtons = [...embedData.buttons];
                            newButtons[index].label = e.target.value;
                            setEmbedData({ ...embedData, buttons: newButtons });
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                          placeholder="Button Label"
                        />
                        <select
                          value={button.style}
                          onChange={(e) => {
                            const newButtons = [...embedData.buttons];
                            newButtons[index].style = e.target.value;
                            setEmbedData({ ...embedData, buttons: newButtons });
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                        >
                          <option value="primary">Primary/Blurple (Disabled)</option>
                          <option value="secondary">Secondary/Grey (Disabled)</option>
                          <option value="success">Success/Green (Disabled)</option>
                          <option value="danger">Danger/Red (Disabled)</option>
                          <option value="link">Link (Functional)</option>
                        </select>
                        <input
                          type="text"
                          value={button.url}
                          onChange={(e) => {
                            const newButtons = [...embedData.buttons];
                            newButtons[index].url = e.target.value;
                            setEmbedData({ ...embedData, buttons: newButtons });
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                          placeholder="URL (for link buttons)"
                        />
                        <input
                          type="text"
                          value={button.emoji}
                          onChange={(e) => {
                            const newButtons = [...embedData.buttons];
                            newButtons[index].emoji = e.target.value;
                            setEmbedData({ ...embedData, buttons: newButtons });
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                          placeholder="Emoji (optional)"
                        />
                        <input
                          type="number"
                          min="0"
                          max="4"
                          value={button.row}
                          onChange={(e) => {
                            const newButtons = [...embedData.buttons];
                            newButtons[index].row = parseInt(e.target.value) || 0;
                            setEmbedData({ ...embedData, buttons: newButtons });
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-sm ${isDark ? "bg-black/50 border border-white/10" : "bg-white border border-black/10"}`}
                          placeholder="Row (0-4)"
                        />
                      </div>
                    </div>
                  ))}
                  {embedData.buttons.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No buttons added. Click "Add Button" to create one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
