"use client";

import { useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_COMMANDS, Command } from "@/lib/commands-data";
import { getCommandParent } from "@/lib/command-hierarchy";

export default function Commands() {
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getFullCommandPath = (cmd: Command): string => {
    // Commands are already complete - no need to add parent paths
    return cmd.name;
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    Object.values(ALL_COMMANDS).forEach(cmd => {
      if (cmd.category) {
        cats.add(cmd.category);
      }
    });
    return Array.from(cats).sort();
  }, []);

  const filteredCommands = useMemo(() => {
    return Object.values(ALL_COMMANDS).filter((cmd) => {
      // Category filter
      if (selectedCategory !== "all" && cmd.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const fullPath = getFullCommandPath(cmd);
        const matchesSearch = 
          fullPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (!matchesSearch) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by category first, then by command name
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      const fullA = getFullCommandPath(a);
      const fullB = getFullCommandPath(b);
      return fullA.localeCompare(fullB);
    });
  }, [searchTerm, selectedCategory]);

  const totalCommands = Object.values(ALL_COMMANDS).length;
  const totalPrefixCommands = Object.values(ALL_COMMANDS).filter(cmd => cmd.has_prefix).length;
  const totalSlashCommands = Object.values(ALL_COMMANDS).filter(cmd => cmd.has_slash).length;

  const formatPermissions = (permissions: string[] = []) => {
    if (!permissions || permissions.length === 0) return "None";
    return permissions.map(p => 
      p.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).join(', ');
  };

  const formatArguments = (required: any[] = [], optional: any[] = []) => {
    const total = required.length + optional.length;
    if (total === 0) return { summary: "None", details: [] };
    
    const details: Array<{name: string, type: string, required: boolean}> = [];
    
    required.forEach(arg => {
      if (arg.name) {
        details.push({
          name: arg.name,
          type: arg.type || 'text',
          required: true
        });
      }
    });
    
    optional.forEach(arg => {
      if (arg.name) {
        details.push({
          name: arg.name,
          type: arg.type || 'text',
          required: false
        });
      }
    });
    
    const parts = [];
    if (required.length > 0) parts.push(`${required.length} required`);
    if (optional.length > 0) parts.push(`${optional.length} optional`);
    
    return { summary: parts.join(', '), details };
  };

  const getCommandTypes = (cmd: Command): string[] => {
    const types = [];
    if (cmd.has_prefix) types.push("Prefix");
    if (cmd.has_slash) types.push("Slash");
    return types;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Minimal background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${isDark ? "bg-white" : "bg-black"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Navigation isDark={isDark} setIsDark={setIsDark} />

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? "text-white" : "text-black"}`}>
              Command Reference
            </h1>
          </div>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-4`}>
            Browse all {totalCommands} commands across all categories
          </p>

          <div className={`p-4 rounded-lg mb-6 ${isDark ? "bg-gray-900/50 border border-white/10" : "bg-gray-100/50 border border-black/10"}`}>
            <p className={`text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Need help? Use <span className="font-mono font-semibold">?help</span> or <span className="font-mono font-semibold">/help</span> with our bot.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              <motion.button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === "all"
                    ? isDark 
                      ? "bg-white text-black shadow-lg shadow-white/20" 
                      : "bg-black text-white shadow-lg shadow-black/20"
                    : isDark
                      ? "bg-gray-900/50 border border-white/10 text-gray-300 hover:bg-gray-900/80"
                      : "bg-gray-100/50 border border-black/10 text-gray-700 hover:bg-gray-100/80"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Commands
              </motion.button>
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat
                      ? isDark 
                        ? "bg-white text-black shadow-lg shadow-white/20" 
                        : "bg-black text-white shadow-lg shadow-black/20"
                      : isDark
                        ? "bg-gray-900/50 border border-white/10 text-gray-300 hover:bg-gray-900/80"
                        : "bg-gray-100/50 border border-black/10 text-gray-700 hover:bg-gray-100/80"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-6 py-4 rounded-xl ${isDark ? "bg-gradient-to-r from-gray-900/90 to-black/90 border-white/10 text-white placeholder-gray-500" : "bg-gradient-to-r from-gray-100/90 to-white/90 border-black/10 text-black placeholder-gray-500"} border focus:outline-none transition-all duration-300`}
              />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredCommands.map((cmd, index) => {
              const commandTypes = getCommandTypes(cmd);
              const fullPath = getFullCommandPath(cmd);
              
              return (
                <motion.div
                  key={`${cmd.category}:${cmd.name}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className={`group relative p-5 rounded-xl ${isDark ? "bg-gradient-to-br from-gray-900/80 to-black/80 border-white/10 hover:border-white/30" : "bg-gradient-to-br from-gray-100/80 to-white/80 border-black/10 hover:border-black/30"} border transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-white/5 to-transparent" : "bg-gradient-to-br from-black/5 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`text-lg font-bold ${isDark ? "text-white group-hover:text-gray-200" : "text-black group-hover:text-gray-800"} transition-colors`}>
                        {fullPath}
                      </h3>
                    </div>

                    

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className={`text-xs px-2 py-1 rounded-md ${isDark ? "bg-purple-500/20 border-purple-500/30 text-purple-300" : "bg-purple-500/20 border-purple-500/30 text-purple-700"} border`}>
                        {cmd.category}
                      </span>
                    </div>

                  {cmd.aliases && cmd.aliases.length > 0 && (
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>Aliases:</span>
                        {cmd.aliases.map((alias, aliasIndex) => (
                          <motion.span
                            key={alias}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.02 + aliasIndex * 0.05 }}
                            className={`text-xs px-2 py-1 rounded-md ${isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-black/5 border-black/10 text-gray-600"} border`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {alias}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}

                    <div className="mb-3">
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
                        {cmd.description}
                      </p>
                    </div>

                    <motion.div 
                      className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span>Arguments</span>
                      <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />
                    </motion.div>
                    <motion.div className="mt-2">
                      {(() => {
                        const argData = formatArguments(cmd.required_args, cmd.optional_args);
                        if (argData.details.length === 0) {
                          return (
                            <span className={`text-xs ${isDark ? "text-gray-600" : "text-gray-500"}`}>
                              {argData.summary}
                            </span>
                          );
                        }
                        return (
                          <div className="space-y-1">
                            {argData.details.map((arg, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  arg.required 
                                    ? isDark ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-red-500/20 text-red-700 border border-red-500/30"
                                    : isDark ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-blue-500/20 text-blue-700 border border-blue-500/30"
                                }`}>
                                  {arg.required ? 'required' : 'optional'}
                                </span>
                                <span className={`text-xs font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                  {arg.name}
                                </span>
                                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                                  ({arg.type})
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </motion.div>

                    <motion.div 
                      className={`mt-3 flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <span>Permissions</span>
                      <div className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-black/10"}`} />
                    </motion.div>
                    <motion.div 
                      className="mt-2"
                    >
                      <span className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-white/10 text-gray-400 border-white/20" : "bg-black/10 text-gray-600 border-black/20"} border`}>
                        {formatPermissions(cmd.permissions)}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredCommands.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              No commands found matching your search
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}