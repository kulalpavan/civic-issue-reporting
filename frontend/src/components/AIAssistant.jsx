import { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Slide,
  Alert
} from '@mui/material';
import {
  Psychology as AIIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Category as DepartmentIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Department mapping for issue classification
const DEPARTMENTS = {
  transportation: {
    name: 'Transportation Department',
    keywords: ['road', 'traffic', 'pothole', 'street', 'highway', 'bridge', 'sidewalk', 'crossing', 'signal', 'parking'],
    color: '#3b82f6',
    icon: '🚗'
  },
  utilities: {
    name: 'Public Utilities Department',
    keywords: ['water', 'electricity', 'power', 'sewer', 'drainage', 'utility', 'outage', 'leak', 'pipe'],
    color: '#10b981',
    icon: '⚡'
  },
  sanitation: {
    name: 'Sanitation Department',
    keywords: ['garbage', 'waste', 'trash', 'cleaning', 'sanitation', 'bins', 'collection', 'dirty', 'smell'],
    color: '#f59e0b',
    icon: '🗑️'
  },
  environment: {
    name: 'Environmental Department',
    keywords: ['pollution', 'noise', 'air', 'environment', 'tree', 'park', 'green', 'noise', 'smoke'],
    color: '#10b981',
    icon: '🌱'
  },
  safety: {
    name: 'Public Safety Department',
    keywords: ['safety', 'security', 'crime', 'emergency', 'fire', 'police', 'dangerous', 'unsafe', 'hazard'],
    color: '#ef4444',
    icon: '🚨'
  },
  infrastructure: {
    name: 'Infrastructure Department',
    keywords: ['building', 'construction', 'maintenance', 'repair', 'structure', 'facility', 'public', 'infrastructure'],
    color: '#8b5cf6',
    icon: '🏗️'
  },
  general: {
    name: 'General Services',
    keywords: [],
    color: '#6b7280',
    icon: '📋'
  }
};

// AI responses for common queries
const AI_RESPONSES = {
  greetings: [
    "Hello! I'm your AI Assistant for civic issues. How can I help you today?",
    "Hi there! I can help you identify the right department for your issue or answer any questions you have.",
    "Welcome! I'm here to assist you with civic issue reporting and answer your queries."
  ],
  help: [
    "I can help you with:\n• Identifying the correct department for your issue\n• Answering questions about the reporting process\n• Providing information about issue status\n• General guidance on civic services",
    "Here's what I can do:\n• Analyze your issue and suggest the appropriate department\n• Explain how to report different types of issues\n• Help you understand the resolution process\n• Answer questions about civic services"
  ],
  process: [
    "To report an issue:\n1. Click 'Report Issue' button\n2. Fill in the title and description\n3. Add a photo if possible\n4. Select the location\n5. Submit your report\n\nI'll help identify the right department based on your description!",
    "The reporting process is simple:\n• Describe your issue clearly\n• Include specific location details\n• Add photos if available\n• I'll automatically suggest the best department to handle it"
  ]
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "👋 Hello! I'm your AI Assistant. I can help identify the right department for your civic issues and answer any questions you have. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI logic to classify issues and provide responses
  const classifyIssue = (text) => {
    const lowerText = text.toLowerCase();
    
    for (const [key, dept] of Object.entries(DEPARTMENTS)) {
      if (key === 'general') continue;
      
      const hasKeyword = dept.keywords.some(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        return dept;
      }
    }
    
    return DEPARTMENTS.general;
  };

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return AI_RESPONSES.greetings[Math.floor(Math.random() * AI_RESPONSES.greetings.length)];
    }
    
    // Check for help requests
    if (lowerInput.includes('help') || lowerInput.includes('what can you do') || lowerInput.includes('how')) {
      return AI_RESPONSES.help[Math.floor(Math.random() * AI_RESPONSES.help.length)];
    }
    
    // Check for process questions
    if (lowerInput.includes('report') || lowerInput.includes('process') || lowerInput.includes('submit')) {
      return AI_RESPONSES.process[Math.floor(Math.random() * AI_RESPONSES.process.length)];
    }
    
    // Check for status questions
    if (lowerInput.includes('status') || lowerInput.includes('track') || lowerInput.includes('update')) {
      return "You can track your issue status in the dashboard. Issues go through these stages:\n• Pending - Just submitted\n• In Progress - Being worked on\n• Resolved - Completed\n\nYou'll receive updates as the status changes.";
    }
    
    // Try to classify as an issue
    const department = classifyIssue(userInput);
    
    if (department.name !== 'General Services') {
      return `Based on your description, this appears to be a **${department.name}** ${department.icon} issue. This department handles: ${department.keywords.join(', ')}.\n\nWould you like me to help you report this issue to the right department?`;
    }
    
    // Default response with department suggestion
    return `I understand you're describing an issue. While I couldn't identify a specific department, I recommend reporting it through our system where it will be properly categorized and assigned.\n\nIs there anything specific about the reporting process you'd like to know?`;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const botMessage = {
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        department: classifyIssue(input)
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <Fab
        color="secondary"
        aria-label="AI Assistant"
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onClick={() => setOpen(true)}
      >
        <AIIcon />
      </Fab>

      {/* AI Assistant Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Department Identification & Query Support
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => setOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0, height: '100%' }}>
          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            background: 'rgba(248, 250, 252, 0.3)'
          }}>
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1
                }}>
                  <Paper sx={{
                    p: 2,
                    maxWidth: '70%',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    color: message.type === 'user' ? 'white' : '#1e293b',
                    borderRadius: message.type === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    boxShadow: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: message.type === 'user' ? 'rgba(255,255,255,0.2)' : '#667eea'
                      }}>
                        {message.type === 'user' ? <UserIcon /> : <BotIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {message.content}
                        </Typography>
                        {message.department && message.department.name !== 'General Services' && (
                          <Chip
                            icon={<DepartmentIcon />}
                            label={message.department.name}
                            size="small"
                            sx={{
                              mt: 1,
                              bgcolor: message.department.color,
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper sx={{
                  p: 2,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: '20px 20px 20px 5px',
                  boxShadow: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                      <BotIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#6b7280' }}>
                      AI is thinking...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2, background: 'white' }}>
            <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
              💡 Describe your issue and I'll identify the right department, or ask me any questions about civic services!
            </Alert>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your issue or ask me anything..."
                disabled={isTyping}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                sx={{
                  minWidth: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  }
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}