import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import disasterKnowledge from '../data/disasterKnowledge.json';
import emergencyHotlines from '../data/emergencyHotlines.json';
import evacuationCenters from '../data/evacuationCenters.json';
import searchHazards from '../logic/checkHazards';
import generateChecklist from '../logic/checklistGenerator';
import createSOSMessage from '../logic/createSOSMessage';
import { detectIntent } from '../logic/intentDetector';

export default function AssistantScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Welcome to your Disaster Preparedness Assistant!

I'm here to help you stay safe during emergencies in the Philippines.

💡 Try asking me:

🌊 Disaster Information
• "What to do during a flood?"
• "How to prepare for an earthquake?"
• "Signs of a typhoon"
• "What is storm surge?"

📋 Preparedness
• "Give me a disaster checklist"
• "What should I put in my go bag?"
• "How to prepare for a volcanic eruption"

📞 Emergency Contacts
• "Show me emergency hotlines"
• "NDRRMC number"
• "Red Cross contact"

📍 Evacuation Centers
• "Find evacuation centers near me"
• "Where to go during a tsunami"

🚨 Emergency
• "Tulong!" or "Help!" - Send SOS

---

Type your question below and I'll help you stay prepared!`
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const getAnswer = async (userInput) => {
    // Detect intent
    let intent = detectIntent(userInput);
    console.log('Intent:', intent);
    console.log('Detected Disaster Type:', intent.extractedData?.disasterType);
    
    // Check if user asks for hotlines in context of disaster info
    const hotlineKeywords = ['hotline', 'contact', 'call', 'phone', 'numero', 'tawag'];
    const hasHotlineRequest = hotlineKeywords.some(kw => userInput.toLowerCase().includes(kw));
    
    if (hasHotlineRequest && intent.extractedData?.disasterType && intent.intent === 'hazard_search') {
      // Override intent to hotline_request if user asking for hotlines during disaster discussion
      intent.intent = 'hotline_request';
    }
    
    // Handle based on intent
    if (intent.intent === "sos_request") {
      const sosMessage = createSOSMessage(
        'User',
        intent.extractedData?.location || {},
        intent.extractedData?.disasterType || 'emergency',
        'Immediate assistance needed',
        { includeNumbers: true, tagalogMode: false }
      );
      return `🚨 ⚠️ EMERGENCY ALERT! ⚠️ 🚨

${sosMessage.smsText}

📞 Call these numbers NOW:
• 911 - National Emergency
• 143 - Philippine Red Cross
• 117 - Police / Fire

Stay calm. Help is on the way.`;
    }
    
    else if (intent.intent === "hazard_search") {
      let searchQuery = intent.extractedData.disasterType || userInput;
      
      const disasterMap = {
        'flood': 'flood', 'baha': 'flood',
        'earthquake': 'earthquake', 'lindol': 'earthquake',
        'typhoon': 'typhoon', 'bagyo': 'typhoon',
        'fire': 'fire', 'sunog': 'fire',
        'volcano': 'volcanic eruption', 'bulkan': 'volcanic eruption',
        'tsunami': 'tsunami', 'alon': 'tsunami',
        'landslide': 'landslide', 'pagguho': 'landslide',
        'storm surge': 'storm surge', 'daluyong': 'storm surge',
        'drought': 'drought', 'tagtuyot': 'drought'
      };
      
      const disasterType = disasterMap[searchQuery.toLowerCase()] || searchQuery.toLowerCase();
      const hazardInfo = searchHazards(disasterType, disasterKnowledge);
      
      if (hazardInfo && hazardInfo.length > 0) {
        const d = hazardInfo[0];
        
        let disasterName = d.disasterType;
        if (disasterName === 'fire (urban)') disasterName = '🔥 FIRE';
        else if (disasterName === 'typhoon') disasterName = '🌀 TYPHOON';
        else if (disasterName === 'flood') disasterName = '🌊 FLOOD';
        else if (disasterName === 'earthquake') disasterName = '🌋 EARTHQUAKE';
        else if (disasterName === 'volcanic eruption') disasterName = '🌋 VOLCANIC ERUPTION';
        else if (disasterName === 'tsunami') disasterName = '🌊 TSUNAMI';
        else if (disasterName === 'landslide') disasterName = '⛰️ LANDSLIDE';
        else disasterName = `⚠️ ${disasterName.toUpperCase()}`;
        
        return `${disasterName}

🔔 Warning Signs:
${d.warningSigns.map(s => `   • ${s}`).join('\n')}

✅ How to Prepare:
${d.prepActions.map(a => `   • ${a}`).join('\n')}

🚨 During the Event:
${d.duringActions.map(a => `   • ${a}`).join('\n')}

🏠 Afterward:
${d.afterActions.map(a => `   • ${a}`).join('\n')}`;
      } else {
        return `❓ I don't have information about "${searchQuery}" yet.

📚 Try asking about:
• flood / baha
• earthquake / lindol
• typhoon / bagyo
• fire / sunog
• volcanic eruption / bulkan
• tsunami / alon
• landslide / pagguho`;
      }
    }
    
    else if (intent.intent === "checklist_generation") {
      // Use detected disaster type or default to general preparedness
      const disasterType = intent.extractedData?.disasterType || 'typhoon';
      const checklist = generateChecklist(disasterType, {});
      const critical = checklist.filter(item => item.priority === 1);
      const important = checklist.filter(item => item.priority === 2);
      
      const disasterLabel = (disasterType && disasterType !== 'undefined' && disasterType !== '') 
        ? ` FOR ${disasterType.toUpperCase()}` 
        : '';
      
      return `📋 EMERGENCY PREPAREDNESS CHECKLIST${disasterLabel}

🔴 DO THESE FIRST (Critical)
${critical.slice(0, 6).map(item => `   • ${item.item}`).join('\n')}

🟡 Important Preparations
${important.slice(0, 5).map(item => `   • ${item.item}`).join('\n')}

💡 Pro Tip: Start with the critical items. A "Go Bag" ready now saves lives later!`;
    }
    
    else if (intent.intent === "hotline_request") {
      // Check if user mentioned a specific disaster
      const disasterType = intent.extractedData?.disasterType;
      
      // Map disasters to relevant hotline categories
      const disasterHotlineMap = {
        'flood': ['emergency', 'disaster', 'medical_rescue'],
        'earthquake': ['emergency', 'disaster', 'medical_rescue'],
        'typhoon': ['emergency', 'disaster'],
        'fire (urban)': ['emergency', 'medical_rescue', 'law_enforcement'],
        'volcanic eruption': ['emergency', 'disaster'],
        'tsunami': ['emergency', 'disaster'],
        'landslide': ['emergency', 'disaster'],
        'drought': ['disaster'],
        'thunderstorm': ['emergency', 'disaster'],
        'storm surge': ['emergency', 'disaster']
      };
      
      let relevantHotlines;
      let disasterLabel = '';
      
      if (disasterType && disasterHotlineMap[disasterType]) {
        // Filter hotlines by disaster-specific categories
        const relevantCategories = disasterHotlineMap[disasterType];
        relevantHotlines = emergencyHotlines.filter(h => 
          relevantCategories.includes(h.category)
        ).slice(0, 8);
        disasterLabel = ` FOR ${disasterType.toUpperCase()}`;
      } else {
        // Generic hotlines
        relevantHotlines = emergencyHotlines.filter(h => 
          h.category === 'emergency' || h.category === 'medical_rescue' || h.category === 'disaster'
        ).slice(0, 8);
      }
      
      return `📞 EMERGENCY HOTLINES${disasterLabel} - PHILIPPINES

${relevantHotlines.map(h => `• ${h.serviceName}: ${h.phoneNumber}\n   ${h.description}`).join('\n\n')}

💡 Save these numbers in your phone now!

📱 Tip: Even without signal, keep these numbers saved for when service returns.`;
    }
    
    else if (intent.intent === "evacuation_center_lookup") {
      const location = intent.extractedData?.location;
      
      let relevantCenters = evacuationCenters;
      if (location) {
        // Filter centers by location
        relevantCenters = evacuationCenters.filter(center => 
          center.location.city.toLowerCase().includes(location.toLowerCase()) ||
          center.location.barangay.toLowerCase().includes(location.toLowerCase()) ||
          center.location.region.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      // Always show centers if available, even without specific location
      if (relevantCenters && relevantCenters.length > 0) {
        const centersToShow = relevantCenters.slice(0, 3);
        const centersInfo = centersToShow.map(center => {
          const facilities = center.facilities ? center.facilities.join(', ') : 'Standard facilities';
          return `📍 ${center.name}
   📌 ${center.location.barangay}, ${center.location.city} | ${center.location.region}
   👥 Capacity: ${center.capacity} people
   📞 ${center.contactPhone}
   🏗️ Facilities: ${facilities}`;
        }).join('\n\n');
        
        const locationText = location ? ` near ${location}` : ' available in the database';
        return `🏢 EVACUATION CENTERS${locationText.toUpperCase()}

${centersInfo}

🏃 Remember: Know your route before disaster strikes!`;
      } else {
        return `🏢 EVACUATION CENTERS

❌ No evacuation centers found${location ? ` near ${location}` : ''}.

📍 Try searching for centers in:
• City (e.g., "Quezon City", "Manila", "Makati")
• Barangay (e.g., "Bagumbayan", "Balangiga")
• Region (e.g., "NCR")

Example: "Evacuation centers in Manila" or "Show evacuation shelters in QC"`;
      }
    }
    
    else {
      return `💬 Need help? Here's what I can do:

🌊 Get Disaster Info
   • "What to do during a flood?"
   • "Earthquake safety tips"
   • "Typhoon warning signs"

📋 Get Prepared
   • "Show me a checklist"
   • "What to put in go bag"
   • "How to prepare for volcanic eruption"

📞 Find Contacts
   • "Emergency hotlines"
   • "NDRRMC number"
   • "Red Cross contact"

📍 Find Shelters
   • "Evacuation centers near me"
   • "Where to go during tsunami"

🚨 Emergency
   • Type "TULONG" or "HELP" for SOS

---
Ask me anything about disaster preparedness in the Philippines! 🇵🇭`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const answer = await getAnswer(input);
      const botMessage = { role: 'assistant', text: answer };
      setMessages(prev => [...prev, botMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error(error);
      const errorMessage = { role: 'assistant', text: '🙏 Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Welcome back!

I'm your Disaster Preparedness Assistant. Ask me about:
• Floods, earthquakes, typhoons
• Emergency checklists
• Hotlines and evacuation centers

Type "help" anytime to see what I can do!`
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg, index) => (
          <View key={`msg-${index}-${msg.role}`} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.assistantMessage]}>
            <Text style={msg.role === 'user' ? styles.userText : styles.assistantText}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.assistantMessage}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.assistantText}> Thinking...</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about floods, earthquakes, typhoons..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  message: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    maxWidth: '90%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a73e8',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  assistantText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: 45,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});