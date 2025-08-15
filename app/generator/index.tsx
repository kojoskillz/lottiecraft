import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const daysOfWeek = [
  { id: '1', name: 'Monday' },
  { id: '2', name: 'Tuesday' },
  { id: '3', name: 'Wednesday' },
  { id: '4', name: 'Thursday' },
  { id: '5', name: 'Friday' },
];

const subjects = [
  { id: '1', name: 'Science' },
  { id: '2', name: 'Mathematics' },
  { id: '3', name: 'English Language' },
  { id: '4', name: 'Creative Arts' },
  { id: '5', name: 'Career Technology' },
  { id: '6', name: 'Social Studies' },
  { id: '7', name: 'RME' },
  { id: '8', name: 'Ghanaian Language' },
  { id: '9', name: 'Our World and Our People' },
  { id: '10', name: 'History' },
  { id: '11', name: 'Numeracy' },
  { id: '12', name: 'Language and Literacy' },
];

const classLevels = [
  { id: '1', name: 'KG 1' }, 
  { id: '2', name: 'KG 2' }, 
  { id: '3', name: 'Basic 1' },
  { id: '4', name: 'Basic 2' },
  { id: '5', name: 'Basic 3' },
  { id: '6', name: 'Basic 4' },
  { id: '7', name: 'Basic 5' },
  { id: '8', name: 'Basic 6' },
  { id: '9', name: 'Basic 7' },
  { id: '10', name: 'Basic 8' },
  { id: '11', name: 'Basic 9' },
];

const coreCompetenciesList = [
  { id: '1', name: 'Critical Thinking & Problem Solving' },
  { id: '2', name: 'Creativity & Innovation' },
  { id: '3', name: 'Communication Skills' },
  { id: '4', name: 'Collaboration & Teamwork' },
  { id: '5', name: 'Cultural Identity & Global Citizenship' },
  { id: '6', name: 'Digital Literacy' },
  { id: '7', name: 'Numeracy & Scientific Literacy' },
  { id: '8', name: 'Financial Literacy & Entrepreneurship' },
  { id: '9', name: 'Leadership & Personal Development' },
  { id: '10', name: 'Environmental Stewardship' },
  { id: '11', name: 'Gross Motor Skills Development' },
  { id: '12', name: 'Fine Motor Skills Development' },
  { id: '13', name: 'Social-Emotional Learning' },
  { id: '14', name: 'Early Language Acquisition' },
  { id: '15', name: 'Sensory Exploration' }
];

const lessonNumbers = [
  { id: '1', name: '1 of 1' },
  { id: '2', name: '1 of 2' },
  { id: '3', name: '2 of 2' },
  { id: '4', name: '1 of 3' },
  { id: '5', name: '2 of 3' },
  { id: '6', name: '3 of 3' },
  { id: '7', name: '1 of 4' },
  { id: '8', name: '2 of 4' },
  { id: '9', name: '3 of 4' },
  { id: '10', name: '4 of 4' },
  { id: '11', name: '1 of 5' },
  { id: '12', name: '2 of 5' },
  { id: '13', name: '3 of 5' },
  { id: '14', name: '4 of 5' },
  { id: '15', name: '5 of 5' },
  { id: '16', name: '1 of 6' },
  { id: '17', name: '2 of 6' },
  { id: '18', name: '3 of 6' },
  { id: '19', name: '4 of 6' },
  { id: '20', name: '5 of 6' },
  { id: '21', name: '6 of 6' },
];

const terms = [
  { id: '1', name: 'Term 1' },
  { id: '2', name: 'Term 2' },
  { id: '3', name: 'Term 3' },
  { id: '4', name: 'Semester 1' },
  { id: '5', name: 'Semester 2' },
];

const weeksList = Array.from({ length: 16 }, (_, i) => ({
  id: String(i + 1),
  name: `Week ${i + 1}`,
}));

const modelOptions = [
  { id: 'gpt-4o-mini', name: 'gpt-4o-mini (OpenAI)' },
  { id: 'gpt-4o', name: 'gpt-4o (OpenAI)' },
  { id: 'llama3-8b-8192', name: 'llama3-8b-8192 (Groq)' },
];

// Maps a given date to a term (1–3) and week (1–16) based on a start date for the academic year.
// Adjust 'ACADEMIC_YEAR_START' to the first Monday (or relevant start) of your school year.
const ACADEMIC_YEAR_START = new Date(new Date().getFullYear(), 0, 8); // Example: Jan 8 of current year

function computeTermAndWeekFromDate(dateString: string) {
  try {
    const date = new Date(dateString);
    const start = new Date(ACADEMIC_YEAR_START);
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const diffMs = date.setHours(0,0,0,0) - start.setHours(0,0,0,0);
    if (diffMs < 0) return { term: '', week: '' };
    const weekIndex = Math.floor(diffMs / msInWeek); // 0-based
    const weekNumber = Math.min(weekIndex + 1, 16); // cap to 16
    let termNumber = 1;
    if (weekNumber >= 1 && weekNumber <= 16) {
      // Simple mapping: weeks 1-16 belong to a single term window.
      // If your year spans three terms consecutively, uncomment below and set proper cutoffs.
      // termNumber = weekNumber <= 16 ? 1 : weekNumber <= 32 ? 2 : 3;
      termNumber = 1;
    }
    return { term: `Term ${termNumber}`, week: `Week ${weekNumber}` };
  } catch {
    return { term: '', week: '' };
  }
}

export default function GeneratorScreen() {
  const [weekEnding, setWeekEnding] = useState('');
  const [day, setDay] = useState('');
  const [showDayModal, setShowDayModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showCoreCompetenciesModal, setShowCoreCompetenciesModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [classSize, setClassSize] = useState('');
  const [strand, setStrand] = useState('');
  const [subStrand, setSubStrand] = useState('');
  const [contentStandard, setContentStandard] = useState('');
  const [indicator, setIndicator] = useState('');
  const [lessonNumber, setLessonNumber] = useState('');
  const [performanceIndicator, setPerformanceIndicator] = useState('');
  const [coreCompetencies, setCoreCompetencies] = useState('');
  const [references, setReferences] = useState('');
  const [starterActivities, setStarterActivities] = useState('');
  const [newLearningActivities, setNewLearningActivities] = useState('');
  const [reflectionActivities, setReflectionActivities] = useState('');
  const [resources, setResources] = useState('');
  const [assessmentQuestions, setAssessmentQuestions] = useState('');
  const [isGeneratingNewLearning, setIsGeneratingNewLearning] = useState(false);
  const [isGeneratingStarter, setIsGeneratingStarter] = useState(false);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [showAIOptionsModal, setShowAIOptionsModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [aiTone, setAiTone] = useState<'Simple' | 'Engaging' | 'Rigorous'>('Engaging');
  const [aiCount, setAiCount] = useState<5 | 6 | 7 | 8>(7);
  const [aiTemperature, setAiTemperature] = useState<0.4 | 0.6 | 0.8>(0.6);
  const [aiModel, setAiModel] = useState<string>('gpt-4o-mini');
  const [term, setTerm] = useState('');
  const [week, setWeek] = useState('');


  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [generatedLesson, setGeneratedLesson] = useState(null);
  const [showLessonNumberModal, setShowLessonNumberModal] = useState(false);

  const handleDateSelect = (day) => {
    setWeekEnding(day.dateString);
    // Auto-fill term and week from selected date
    const tw = computeTermAndWeekFromDate(day.dateString);
    if (!term && tw.term) setTerm(tw.term);
    if (!week && tw.week) setWeek(tw.week);
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const selectDay = (selectedDay) => {
    setDay(selectedDay);
    setShowDayModal(false);
  };

  const selectSubject = (selectedSubject) => {
    setSubject(selectedSubject);
    setShowSubjectModal(false);
  };

  const selectClass = (selectedClass) => {
    setClassLevel(selectedClass);
    setShowClassModal(false);
  };

  const selectCoreCompetency = (selectedCompetency) => {
    setCoreCompetencies(selectedCompetency);
    setShowCoreCompetenciesModal(false);
  };

  const selectLessonNumber = (selectedLessonNumber) => {
    setLessonNumber(selectedLessonNumber);
    setShowLessonNumberModal(false);
  };

  const selectTerm = (selectedTerm) => {
    setTerm(selectedTerm);
    setShowTermModal(false);
  };

  const selectWeek = (selectedWeek) => {
    setWeek(selectedWeek);
    setShowWeekModal(false);
  };

  const generateLessonNote = () => {
    if (!term) {
      Alert.alert('Error', 'Please select term');
      return;
    }
    if (!week) {
      Alert.alert('Error', 'Please select week');
      return;
    }
    if (!weekEnding) {
      Alert.alert('Error', 'Please select week ending date');
      return;
    }
    if (!day) {
      Alert.alert('Error', 'Please select day');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter subject');
      return;
    }
    if (!classLevel.trim()) {
      Alert.alert('Error', 'Please enter class');
      return;
    }
    if (!subStrand.trim()) {
      Alert.alert('Error', 'Please enter sub-strand');
      return;
    }
    if (!lessonNumber.trim()) {
      Alert.alert('Error', 'Please select lesson number');
      return;
    }

    const lesson = {
      term,
      week,
      weekEnding,
      day,
      subject,
      duration,
      classLevel,
      classSize,
      strand,
      subStrand,
      contentStandard,
      indicator,
      lessonNumber,
      performanceIndicator,
      coreCompetencies,
      references,
      starterActivities,
      newLearningActivities,
      reflectionActivities,
      resources,
      assessmentQuestions
    };
    setGeneratedLesson(lesson);
    setActiveTab('preview');
  };

  const kgResources = classLevel.includes('KG') 
  ? [
      "Picture cards",
      "Storybooks",
      "Counting objects (beans, blocks)",
      "Playdough",
      "Art materials (crayons, paper)",
      "Musical instruments",
      "Real objects for exploration"
    ].join(', ')
  : '';

  const normalizeActivitiesText = (raw: string) => {
    return raw
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*([\-\*\u2022]|\d+\.|\d+\)|\([a-zA-Z]\))\s*/,'').trim())
      .filter(Boolean)
      .join('\n');
  };


  const generateStarterWithAI = async () => {
    try {
      if (!subject.trim() || !classLevel.trim() || !subStrand.trim()) {
        Alert.alert('Missing info', 'Please provide at least Subject, Class, and Sub-Strand to generate activities.');
        return;
      }
      
      const groqKey = process.env.EXPO_PUBLIC_GROQ_API_KEY as string | undefined;
      const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined;
      const usingGroq = Boolean(groqKey);
      const usingOpenAI = !usingGroq && Boolean(openaiKey);
      if (!usingGroq && !usingOpenAI) {
        Alert.alert('Missing API key', 'Set EXPO_PUBLIC_GROQ_API_KEY (recommended, free tier) or EXPO_PUBLIC_OPENAI_API_KEY before starting the app.');
        return;
      }
  
      setIsGeneratingStarter(true);
  
      const systemPrompt = 'You are an expert primary school lesson planner. Generate engaging, interactive starter activities for PHASE 1: STARTER. Keep activities short, fun, and relevant to the lesson topic.';
      const userPrompt = `Create PHASE 1: STARTER activities.
  Context:
  - Term: ${term || '-'}
  - Week: ${week || '-'}
  - Week Ending: ${weekEnding || '-'}
  - Day: ${day || '-'}
  - Subject: ${subject}
  - Class: ${classLevel || '-'} (Class Size: ${classSize || '-'})
  - Duration: ${duration || '-'}
  - Strand: ${strand || '-'}
  - Sub-Strand/Topic: ${subStrand}
  - Content Standard: ${contentStandard || '-'}
  - Indicator: ${indicator || '-'}
  - Performance Indicator: ${performanceIndicator || '-'}
  - Core Competencies: ${coreCompetencies || '-'}
  - Available Resources: ${resources || '-'}
  
  Instructions:
  - Tone: ${aiTone}
  - Produce exactly ${aiCount} specific activities for the STARTER phase.
  - Activities should be 3-5 minutes each
  - Use clear, simple sentences. 
  - Incorporate movement or interaction where appropriate.
  - If resources are provided, use them.
  - Output format: Only the activities, one per line, no numbering or bullets.`;
  
      const baseUrl = usingGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      let chosenModel = aiModel;
      if (usingGroq && /^gpt/i.test(chosenModel)) {
        chosenModel = 'llama3-8b-8192';
      }
      if (usingOpenAI && /^llama/i.test(chosenModel)) {
        chosenModel = 'gpt-4o-mini';
      }
      
      const authToken = usingGroq ? groqKey! : openaiKey!;
      const resp = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          temperature: aiTemperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
  
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Request failed: ${resp.status}`);
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || '';
      const normalized = normalizeActivitiesText(content);
      if (!normalized) {
        Alert.alert('No content', 'AI did not return any activities. Please try again.');
      }
      setStarterActivities(normalized);
    } catch (e) {
      console.error('AI generation error:', e);
      Alert.alert('AI Error', 'Failed to generate activities. Please try again.');
    } finally {
      setIsGeneratingStarter(false);
    }
  };

  const generateNewLearningWithAI = async () => {
    try {
      if (!subject.trim() || !classLevel.trim() || !subStrand.trim()) {
        Alert.alert('Missing info', 'Please provide at least Subject, Class, and Sub-Strand to generate activities.');
        return;
      }
      const groqKey = process.env.EXPO_PUBLIC_GROQ_API_KEY as string | undefined;
      const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined;
      const usingGroq = Boolean(groqKey);
      const usingOpenAI = !usingGroq && Boolean(openaiKey);
      if (!usingGroq && !usingOpenAI) {
        Alert.alert('Missing API key', 'Set EXPO_PUBLIC_GROQ_API_KEY (recommended, free tier) or EXPO_PUBLIC_OPENAI_API_KEY before starting the app.');
        return;
      }

      setIsGeneratingNewLearning(true);

      const systemPrompt = 'You are an expert primary school lesson planner. Generate concrete, student-centered classroom activities for PHASE 2: NEW LEARNING. Keep steps practical and age-appropriate.';
      const userPrompt = `Create PHASE 2: NEW LEARNING activities.
Context:
- Term: ${term || '-'}
- Week: ${week || '-'}
- Week Ending: ${weekEnding || '-'}
- Day: ${day || '-'}
- Subject: ${subject}
- Class: ${classLevel || '-'} (Class Size: ${classSize || '-'})
- Duration: ${duration || '-'}
- Strand: ${strand || '-'}
- Sub-Strand/Topic: ${subStrand}
- Content Standard: ${contentStandard || '-'}
- Indicator: ${indicator || '-'}
- Performance Indicator: ${performanceIndicator || '-'}
- Core Competencies: ${coreCompetencies || '-'}
- Available Resources: ${resources || '-'}

Instructions:
- Tone: ${aiTone}
- Produce exactly ${aiCount} specific activities for the NEW LEARNING phase.
- Use clear, simple sentences. Mention group/pair work where helpful.
- Incorporate short checks for understanding.
- If resources are provided, use them.
- Output format: Only the activities, one per line, no numbering or bullets.`;

      const baseUrl = usingGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      let chosenModel = aiModel;
      if (usingGroq && /^gpt/i.test(chosenModel)) {
        chosenModel = 'llama3-8b-8192';
      }
      if (usingOpenAI && /^llama/i.test(chosenModel)) {
        chosenModel = 'gpt-4o-mini';
      }
      // Extra safety: any 70b or older llama names fall back to Groq's current 8b ID
      if (usingGroq && (/70b/i.test(chosenModel) || /llama-?3\.1-?8b/i.test(chosenModel))) {
        chosenModel = 'llama3-8b-8192';
      }
      const authToken = usingGroq ? groqKey! : openaiKey!;
      const resp = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          temperature: aiTemperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Request failed: ${resp.status}`);
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || '';
      const normalized = normalizeActivitiesText(content);
      if (!normalized) {
        Alert.alert('No content', 'AI did not return any activities. Please try again.');
      }
      setNewLearningActivities(normalized);
    } catch (e) {
      console.error('AI generation error:', e);
      Alert.alert('AI Error', 'Failed to generate activities. Please try again.');
    } finally {
      setIsGeneratingNewLearning(false);
    }
  };

  const generateReflectionWithAI = async () => {
    try {
      if (!subject.trim() || !classLevel.trim() || !subStrand.trim()) {
        Alert.alert('Missing info', 'Please provide at least Subject, Class, and Sub-Strand to generate activities.');
        return;
      }
      
      const groqKey = process.env.EXPO_PUBLIC_GROQ_API_KEY as string | undefined;
      const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined;
      const usingGroq = Boolean(groqKey);
      const usingOpenAI = !usingGroq && Boolean(openaiKey);
      if (!usingGroq && !usingOpenAI) {
        Alert.alert('Missing API key', 'Set EXPO_PUBLIC_GROQ_API_KEY (recommended, free tier) or EXPO_PUBLIC_OPENAI_API_KEY before starting the app.');
        return;
      }
  
      setIsGeneratingReflection(true);
  
      const systemPrompt = 'You are an expert primary school lesson planner. Generate meaningful reflection activities for PHASE 3: REFLECTION. Focus on helping students consolidate their learning and assess their understanding.';
      const userPrompt = `Create PHASE 3: REFLECTION activities.
  Context:
  - Term: ${term || '-'}
  - Week: ${week || '-'}
  - Week Ending: ${weekEnding || '-'}
  - Day: ${day || '-'}
  - Subject: ${subject}
  - Class: ${classLevel || '-'} (Class Size: ${classSize || '-'})
  - Duration: ${duration || '-'}
  - Strand: ${strand || '-'}
  - Sub-Strand/Topic: ${subStrand}
  - Content Standard: ${contentStandard || '-'}
  - Indicator: ${indicator || '-'}
  - Performance Indicator: ${performanceIndicator || '-'}
  - Core Competencies: ${coreCompetencies || '-'}
  - Available Resources: ${resources || '-'}
  - Starter Activities: ${starterActivities || '-'}
  - New Learning Activities: ${newLearningActivities || '-'}
  
  Instructions:
  - Tone: ${aiTone}
  - Produce exactly ${aiCount} specific activities for the REFLECTION phase.
  - Activities should help students reflect on what they learned
  - Include self-assessment and peer-sharing where appropriate
  - Connect back to the lesson objectives
  - Use clear, simple sentences.
  - If resources are provided, use them.
  - Output format: Only the activities, one per line, no numbering or bullets.`;
  
      const baseUrl = usingGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      let chosenModel = aiModel;
      if (usingGroq && /^gpt/i.test(chosenModel)) {
        chosenModel = 'llama3-8b-8192';
      }
      if (usingOpenAI && /^llama/i.test(chosenModel)) {
        chosenModel = 'gpt-4o-mini';
      }
      
      const authToken = usingGroq ? groqKey! : openaiKey!;
      const resp = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          temperature: aiTemperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
  
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Request failed: ${resp.status}`);
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || '';
      const normalized = normalizeActivitiesText(content);
      if (!normalized) {
        Alert.alert('No content', 'AI did not return any activities. Please try again.');
      }
      setReflectionActivities(normalized);
    } catch (e) {
      console.error('AI generation error:', e);
      Alert.alert('AI Error', 'Failed to generate activities. Please try again.');
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  const generateAssessmentWithAI = async () => {
    try {
      if (!subject.trim() || !classLevel.trim() || !subStrand.trim()) {
        Alert.alert('Missing info', 'Please provide at least Subject, Class, and Sub-Strand to generate assessment questions.');
        return;
      }
      
      const groqKey = process.env.EXPO_PUBLIC_GROQ_API_KEY as string | undefined;
      const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined;
      const usingGroq = Boolean(groqKey);
      const usingOpenAI = !usingGroq && Boolean(openaiKey);
      if (!usingGroq && !usingOpenAI) {
        Alert.alert('Missing API key', 'Set EXPO_PUBLIC_GROQ_API_KEY (recommended, free tier) or EXPO_PUBLIC_OPENAI_API_KEY before starting the app.');
        return;
      }
  
      setIsGeneratingAssessment(true);
  
      const systemPrompt = 'You are an expert primary school teacher. Create appropriate assessment questions that evaluate student understanding of the lesson content.';
      const userPrompt = `Create assessment questions for the lesson.
  Context:
  - Term: ${term || '-'}
  - Week: ${week || '-'}
  - Subject: ${subject}
  - Class: ${classLevel || '-'}
  - Strand: ${strand || '-'}
  - Sub-Strand/Topic: ${subStrand}
  - Content Standard: ${contentStandard || '-'}
  - Indicator: ${indicator || '-'}
  - Performance Indicator: ${performanceIndicator || '-'}
  - Core Competencies: ${coreCompetencies || '-'}
  - Starter Activities: ${starterActivities || '-'}
  - New Learning Activities: ${newLearningActivities || '-'}
  - Reflection Activities: ${reflectionActivities || '-'}
  
  Instructions:
  - Tone: ${aiTone}
  - Produce exactly ${aiCount} assessment questions
  - Include a mix of question types (recall, application, analysis)
  - Questions should be age-appropriate for ${classLevel}
  - Align with the lesson objectives and activities
  - Use clear, simple language
  - Output format: Only the questions, one per line, no numbering or bullets.`;
  
      const baseUrl = usingGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      let chosenModel = aiModel;
      if (usingGroq && /^gpt/i.test(chosenModel)) {
        chosenModel = 'llama3-8b-8192';
      }
      if (usingOpenAI && /^llama/i.test(chosenModel)) {
        chosenModel = 'gpt-4o-mini';
      }
      
      const authToken = usingGroq ? groqKey! : openaiKey!;
      const resp = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          temperature: aiTemperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
  
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `Request failed: ${resp.status}`);
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || '';
      const normalized = normalizeActivitiesText(content);
      if (!normalized) {
        Alert.alert('No content', 'AI did not return any questions. Please try again.');
      }
      setAssessmentQuestions(normalized);
    } catch (e) {
      console.error('AI generation error:', e);
      Alert.alert('AI Error', 'Failed to generate assessment questions. Please try again.');
    } finally {
      setIsGeneratingAssessment(false);
    }
  };


  const generateHTML = () => {
    if (!generatedLesson) return '';
    
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #333; text-align: center; }
            h2 { color: #444; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .phase { margin-top: 15px; }
            .activity { margin-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${generatedLesson.term?.toUpperCase() || ''}</h1>
          <h2>WEEKLY LESSON NOTES</h2>
          <h3>${generatedLesson.week?.toUpperCase() || ''}</h3>
          
          <table>
            <tr>
              <th>Week Ending:</th>
              <td>${generatedLesson.weekEnding}</td>
              <th>DAY:</th>
              <td>${generatedLesson.day}</td>
              <th>Subject:</th>
              <td>${generatedLesson.subject}</td>
            </tr>
            <tr>
              <th>Term:</th>
              <td>${generatedLesson.term}</td>
              <th>Week:</th>
              <td colspan="3">${generatedLesson.week}</td>
            </tr>
            <tr>
              <th>Duration:</th>
              <td>${generatedLesson.duration}</td>
              <th>Class:</th>
              <td>${generatedLesson.classLevel}</td>
              <th>Class Size:</th>
              <td>${generatedLesson.classSize}</td>
            </tr>
            <tr>
              <th>Strand:</th>
              <td>${generatedLesson.strand}</td>
              <th>Sub Strand:</th>
              <td colspan="3">${generatedLesson.subStrand}</td>
            </tr>
            <tr>
              <th>Content Standard:</th>
              <td colspan="5">${generatedLesson.contentStandard}</td>
            </tr>
            <tr>
              <th>Indicator:</th>
              <td colspan="5">${generatedLesson.indicator}</td>
            </tr>
            <tr>
              <th>Lesson:</th>
              <td>${generatedLesson.lessonNumber}</td>
              <th>Performance Indicator:</th>
              <td colspan="3">${generatedLesson.performanceIndicator}</td>
            </tr>
            <tr>
              <th>Core Competencies:</th>
              <td colspan="5">${generatedLesson.coreCompetencies}</td>
            </tr>
            <tr>
              <th>References:</th>
              <td colspan="5">${generatedLesson.references}</td>
            </tr>
          </table>
          
          <table>
            <tr>
              <th>Phase/Duration</th>
              <th>Learners Activities</th>
              <th>Resources</th>
            </tr>
            <tr>
              <td>PHASE 1: STARTER</td>
              <td>
                <ul>
                  ${generatedLesson.starterActivities.split('\n').filter(activity => activity.trim()).map(activity => `<li>${activity.trim()}</li>`).join('')}
                </ul>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>PHASE 2: NEW LEARNING</td>
              <td>
                <ul>
                  ${generatedLesson.newLearningActivities.split('\n').filter(activity => activity.trim()).map(activity => `<li>${activity.trim()}</li>`).join('')}
                </ul>
              </td>
              <td>${generatedLesson.resources}</td>
            </tr>
            <tr>
              <td>PHASE 3: REFLECTION</td>
              <td>
                <ul>
                  ${generatedLesson.reflectionActivities.split('\n').filter(activity => activity.trim()).map(activity => `<li>${activity.trim()}</li>`).join('')}
                </ul>
              </td>
              <td></td>
            </tr>
          </table>
          
          <div class="phase">
            <h3>Assessment</h3>
            <ul>
              ${generatedLesson.assessmentQuestions.split('\n').filter(question => question.trim()).map(question => `<li>${question.trim()}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `;
  };

  const exportToPDF = async () => {
    try {
      if (!generatedLesson) {
        Alert.alert('Error', 'No lesson generated yet');
        return;
      }

      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({
        html,
        width: 612,
        height: 792,
        base64: false
      });

      const newUri = `${FileSystem.documentDirectory}LessonPlan_${generatedLesson.subStrand.replace(/\s+/g, '_')}.pdf`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: newUri
      });

      Alert.alert('Success', 'PDF generated successfully!');
      await Sharing.shareAsync(newUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Lesson Plan',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  const exportToWord = async () => {
    try {
      if (!generatedLesson) {
        Alert.alert('Error', 'No lesson generated yet');
        return;
      }

      const html = generateHTML();
      const fileName = `LessonPlan_${generatedLesson.subStrand.replace(/\s+/g, '_')}.doc`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, html, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert('Success', 'Word document generated successfully!');
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/msword',
        dialogTitle: 'Share Lesson Plan'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate Word document');
      console.error('Word generation error:', error);
    }
  };

  const clearAllInputs = () => {
    setTerm('');
    setWeek('');
    setWeekEnding('');
    setDay('');
    setSubject('');
    setDuration('');
    setClassLevel('');
    setClassSize('');
    setStrand('');
    setSubStrand('');
    setContentStandard('');
    setIndicator('');
    setLessonNumber('');
    setPerformanceIndicator('');
    setCoreCompetencies('');
    setReferences('');
    setStarterActivities('');
    setNewLearningActivities('');
    setReflectionActivities('');
    setResources('');
    setAssessmentQuestions('');
    setGeneratedLesson(null);
    setActiveTab('create');
  };

  const CreateTab = () => {
    const hasAnyInput = Boolean(
      term || week || weekEnding || day || subject || duration || classLevel || classSize ||
      strand || subStrand || contentStandard || indicator || lessonNumber || performanceIndicator ||
      coreCompetencies || references || starterActivities || newLearningActivities ||
      reflectionActivities || resources || assessmentQuestions
    );
    return (
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
<View style={styles.headerContainer}>
  <LinearGradient 
    colors={['#6366F1', '#8B5CF6']} 
    style={styles.headerGradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 2, y: 2 }}
  >
    <View style={styles.headerContent}>
      <View style={styles.headerIconContainer}>
        <Ionicons name="book-outline" size={32} color="white" />
      </View>
      <Text style={styles.headerTitle}>Create Weekly Lesson Note</Text>
      <Text style={styles.headerSubtitle}>Plan engaging lessons for your students</Text>
    </View>
  </LinearGradient>
  <View style={styles.headerCurve}></View>
</View>

<View style={styles.sectionContainer}>
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleContainer}>
      <Ionicons name="information-circle" size={22} color="#6366F1" />
      <Text style={styles.sectionTitle}>Basic Information</Text>
    </View>
    <View style={styles.sectionDivider} />
  </View>

  <View style={styles.gridContainer}>
    {/* Row 1 - Term and Week */}
    <View style={styles.gridRow}>
      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="school" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Academic Term</Text>
        </View>
        <TouchableOpacity 
          style={styles.selectInput} 
          onPress={() => setShowTermModal(true)}
        >
          <Ionicons name="calendar" size={18} color="#6366F1" style={styles.inputIcon} />
          <Text style={term ? styles.selectInputText : styles.selectInputPlaceholder}>
            {term || 'Select term'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="time" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Week</Text>
        </View>
        <TouchableOpacity 
          style={styles.selectInput} 
          onPress={() => setShowWeekModal(true)}
        >
          <Ionicons name="calendar-number" size={18} color="#6366F1" style={styles.inputIcon} />
          <Text style={week ? styles.selectInputText : styles.selectInputPlaceholder}>
            {week || 'Select week'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Row 2 - Week Ending and Day */}
    <View style={styles.gridRow}>
      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="flag" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Week Ending</Text>
        </View>
        <TouchableOpacity 
          style={styles.selectInput} 
          onPress={toggleCalendar}
        >
          <Ionicons name="calendar-outline" size={18} color="#6366F1" style={styles.inputIcon} />
          <Text style={weekEnding ? styles.selectInputText : styles.selectInputPlaceholder}>
            {weekEnding || 'Select date'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="today" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Day</Text>
        </View>
        <TouchableOpacity 
          style={styles.selectInput} 
          onPress={() => setShowDayModal(true)}
        >
          <Ionicons name="sunny" size={18} color="#6366F1" style={styles.inputIcon} />
          <Text style={day ? styles.selectInputText : styles.selectInputPlaceholder}>
            {day || 'Select day'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Row 3 - Subject and Duration */}
    <View style={styles.gridRow}>
      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="book" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Subject</Text>
        </View>
        <TouchableOpacity 
          style={styles.selectInput} 
          onPress={() => setShowSubjectModal(true)}
        >
          <Ionicons name="library" size={18} color="#6366F1" style={styles.inputIcon} />
          <Text style={subject ? styles.selectInputText : styles.selectInputPlaceholder}>
            {subject || 'Select subject'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="hourglass" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Duration</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Ionicons name="time-outline" size={18} color="#6366F1" style={styles.textInputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="E.g. 45mins"
            placeholderTextColor="#9CA3AF"
            value={duration}
            onChangeText={setDuration}
          />
          {duration.length > 0 && (
            <TouchableOpacity 
              style={styles.clearInputButton} 
              onPress={() => setDuration('')}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>

    {/* Row 4 - Class and Class Size */}
    <View style={styles.gridRow}>
      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="people" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Class</Text>
        </View>
        <TouchableOpacity 
          style={styles.selectInput} 
          onPress={() => setShowClassModal(true)}
        >
          <Ionicons name="school-outline" size={18} color="#6366F1" style={styles.inputIcon} />
          <Text style={classLevel ? styles.selectInputText : styles.selectInputPlaceholder}>
            {classLevel || 'Select class'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <Ionicons name="person" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Class Size</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Ionicons name="people-outline" size={18} color="#6366F1" style={styles.textInputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="E.g. 30"
            placeholderTextColor="#9CA3AF"
            value={classSize}
            onChangeText={setClassSize}
            keyboardType="numeric"
          />
          {classSize.length > 0 && (
            <TouchableOpacity 
              style={styles.clearInputButton} 
              onPress={() => setClassSize('')}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>

    {/* Row 5 - Strand and Sub-Strand */}
    <View style={styles.gridRow}>
      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <MaterialCommunityIcons name="file-tree" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Strand</Text>
        </View>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons 
            name="file-tree" 
            size={18} 
            color="#6366F1" 
            style={styles.textInputIcon} 
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter strand..."
            placeholderTextColor="#9CA3AF"
            value={strand}
            onChangeText={setStrand}
          />
          {strand.length > 0 && (
            <TouchableOpacity 
              style={styles.clearInputButton} 
              onPress={() => setStrand('')}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.gridItem}>
        <View style={styles.inputLabelContainer}>
          <MaterialCommunityIcons name="file-tree-outline" size={16} color="#6366F1" />
          <Text style={styles.inputLabel}>Sub-Strand</Text>
        </View>
        <View style={styles.textInputContainer}>
          <MaterialCommunityIcons 
            name="file-tree-outline" 
            size={18} 
            color="#6366F1" 
            style={styles.textInputIcon} 
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter sub-strand..."
            placeholderTextColor="#9CA3AF"
            value={subStrand}
            onChangeText={setSubStrand}
          />
          {subStrand.length > 0 && (
            <TouchableOpacity 
              style={styles.clearInputButton} 
              onPress={() => setSubStrand('')}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </View>
</View>

<View style={styles.sectionContainer}>
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleContainer}>
      <MaterialCommunityIcons name="file-document-edit" size={22} color="#6366F1" />
      <Text style={styles.sectionTitle}>Curriculum Standards</Text>
    </View>
    <View style={styles.sectionDivider} />
  </View>

  {/* Content Standard */}
  <View style={styles.inputFieldContainer}>
    <View style={styles.inputLabelContainer}>
      <MaterialCommunityIcons name="format-list-checks" size={16} color="#6366F1" />
      <Text style={styles.inputLabel}>Content Standard</Text>
    </View>
    <View style={styles.textAreaContainer}>
      <MaterialCommunityIcons 
        name="text-box" 
        size={18} 
        color="#6366F1" 
        style={styles.textAreaIcon} 
      />
      <TextInput
        style={styles.textAreaInput}
        placeholder="Enter content standard..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        value={contentStandard}
        onChangeText={setContentStandard}
      />
      {contentStandard.length > 0 && (
        <TouchableOpacity 
          style={styles.clearTextAreaButton} 
          onPress={() => setContentStandard('')}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>

  {/* Indicator */}
  <View style={styles.inputFieldContainer}>
    <View style={styles.inputLabelContainer}>
      <MaterialCommunityIcons name="chart-bar" size={16} color="#6366F1" />
      <Text style={styles.inputLabel}>Indicator</Text>
    </View>
    <View style={styles.textAreaContainer}>
      <MaterialCommunityIcons 
        name="cursor-text" 
        size={18} 
        color="#6366F1" 
        style={styles.textAreaIcon} 
      />
      <TextInput
        style={styles.textAreaInput}
        placeholder="Enter indicator..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        value={indicator}
        onChangeText={setIndicator}
      />
      {indicator.length > 0 && (
        <TouchableOpacity 
          style={styles.clearTextAreaButton} 
          onPress={() => setIndicator('')}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>

  {/* Lesson Number */}
  <View style={styles.gridRow}>
    <View style={[styles.gridItem, { flex: 1 }]}>
      <View style={styles.inputLabelContainer}>
        <MaterialCommunityIcons name="numeric" size={16} color="#6366F1" />
        <Text style={styles.inputLabel}>Lesson Number</Text>
      </View>
      <TouchableOpacity 
        style={styles.selectInput} 
        onPress={() => setShowLessonNumberModal(true)}
      >
        <MaterialCommunityIcons 
          name="format-list-numbered" 
          size={18} 
          color="#6366F1" 
          style={styles.inputIcon} 
        />
        <Text style={lessonNumber ? styles.selectInputText : styles.selectInputPlaceholder}>
          {lessonNumber || 'Select lesson number'}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6366F1" />
      </TouchableOpacity>
    </View>
  </View>

  {/* Performance Indicator */}
  <View style={styles.inputFieldContainer}>
    <View style={styles.inputLabelContainer}>
      <MaterialCommunityIcons name="chart-line" size={16} color="#6366F1" />
      <Text style={styles.inputLabel}>Performance Indicator</Text>
    </View>
    <View style={styles.textAreaContainer}>
      <MaterialCommunityIcons 
        name="chart-areaspline" 
        size={18} 
        color="#6366F1" 
        style={styles.textAreaIcon} 
      />
      <TextInput
        style={styles.textAreaInput}
        placeholder="Enter performance indicator..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        value={performanceIndicator}
        onChangeText={setPerformanceIndicator}
      />
      {performanceIndicator.length > 0 && (
        <TouchableOpacity 
          style={styles.clearTextAreaButton} 
          onPress={() => setPerformanceIndicator('')}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>

  {/* Core Competencies */}
  <View style={styles.inputFieldContainer}>
    <View style={styles.inputLabelContainer}>
      <MaterialCommunityIcons name="brain" size={16} color="#6366F1" />
      <Text style={styles.inputLabel}>Core Competencies</Text>
    </View>
    <TouchableOpacity 
      style={styles.selectInput} 
      onPress={() => setShowCoreCompetenciesModal(true)}
    >
      <MaterialCommunityIcons 
        name="lightbulb-on" 
        size={18} 
        color="#6366F1" 
        style={styles.inputIcon} 
      />
      <Text style={coreCompetencies ? styles.selectInputText : styles.selectInputPlaceholder}>
        {coreCompetencies || 'Select core competency'}
      </Text>
      <Ionicons name="chevron-down" size={16} color="#6366F1" />
    </TouchableOpacity>
  </View>

  {/* References */}
  <View style={styles.inputFieldContainer}>
    <View style={styles.inputLabelContainer}>
      <MaterialCommunityIcons name="book-open-variant" size={16} color="#6366F1" />
      <Text style={styles.inputLabel}>References</Text>
    </View>
    <View style={styles.textInputContainer}>
      <MaterialCommunityIcons 
        name="bookmark" 
        size={18} 
        color="#6366F1" 
        style={styles.textInputIcon} 
      />
      <TextInput
        style={styles.textInput}
        placeholder="E.g. Science Curriculum Pg."
        placeholderTextColor="#9CA3AF"
        value={references}
        onChangeText={setReferences}
      />
      {references.length > 0 && (
        <TouchableOpacity 
          style={styles.clearInputButton} 
          onPress={() => setReferences('')}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>
</View>

<View style={styles.sectionContainer}>
  {/* Lesson Phases Header */}
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleContainer}>
      <MaterialCommunityIcons name="progress-clock" size={22} color="#6366F1" />
      <Text style={styles.sectionTitle}>Lesson Phases</Text>
    </View>
    <View style={styles.sectionDivider} />
  </View>

  {/* PHASE 1: STARTER */}
<View style={[styles.phaseHeader]}>
  <View style={styles.phaseHeaderLeft}>
    <MaterialCommunityIcons name="play-circle" size={20} color="#6366F1" />
    <Text style={styles.phaseTitle}>PHASE 1: STARTER ACTIVITIES</Text>
  </View>
  <View style={styles.aiButtonsContainer}>
    <TouchableOpacity 
      style={styles.aiButton} 
      onPress={generateStarterWithAI} 
      disabled={isGeneratingStarter}
    >
      {isGeneratingStarter ? (
        <ActivityIndicator size="small" color="#6366F1" />
      ) : (
        <>
          <Ionicons name="sparkles" size={14} color="#6366F1" />
          <Text style={styles.aiButtonText}>Generate</Text>
        </>
      )}
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.aiOptionsButton} 
      onPress={() => setShowAIOptionsModal(true)}
    >
      <Ionicons name="options" size={14} color="#6366F1" />
    </TouchableOpacity>
  </View>
</View>
<View style={styles.textAreaContainer}>
  <MaterialCommunityIcons 
    name="lightning-bolt" 
    size={18} 
    color="#6366F1" 
    style={styles.textAreaIcon} 
  />
  <TextInput
    style={styles.textAreaInput}
    placeholder="Enter starter activities (one per line)..."
    placeholderTextColor="#9CA3AF"
    multiline
    textAlignVertical="top"
    value={starterActivities}
    onChangeText={setStarterActivities}
  />
  {starterActivities.length > 0 && (
    <TouchableOpacity 
      style={styles.clearTextAreaButton} 
      onPress={() => setStarterActivities('')}
    >
      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  )}
</View>


  {/* PHASE 2: NEW LEARNING */}

    <View style={[styles.phaseHeader]}>
      <View style={styles.phaseHeaderLeft}>
        <MaterialCommunityIcons name="book-education" size={20} color="#6366F1" />
        <Text style={styles.phaseTitle}>PHASE 2: NEW LEARNING</Text>
      </View>
      <View style={styles.aiButtonsContainer}>
        <TouchableOpacity 
          style={styles.aiButton} 
          onPress={generateNewLearningWithAI} 
          disabled={isGeneratingNewLearning}
        >
          {isGeneratingNewLearning ? (
            <ActivityIndicator size="small" color="#6366F1" />
          ) : (
            <>
              <Ionicons name="sparkles" size={14} color="#6366F1" />
              <Text style={styles.aiButtonText}>Generate</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.aiOptionsButton} 
          onPress={() => setShowAIOptionsModal(true)}
        >
          <Ionicons name="options" size={14} color="#6366F1" />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.textAreaContainer}>
      <MaterialCommunityIcons 
        name="brain" 
        size={18} 
        color="#6366F1" 
        style={styles.textAreaIcon} 
      />
      <TextInput
        style={styles.textAreaInput}
        placeholder="Enter new learning activities (one per line)..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        value={newLearningActivities}
        onChangeText={setNewLearningActivities}
      />
      {newLearningActivities.length > 0 && (
        <TouchableOpacity 
          style={styles.clearTextAreaButton} 
          onPress={() => setNewLearningActivities('')}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>


  {/* Resources */}
  <View style={styles.inputFieldContainer}>
    <View style={styles.inputLabelContainer}>
      <MaterialCommunityIcons name="toolbox" size={16} color="#6366F1" />
      <Text style={styles.inputLabel}>Teaching Resources</Text>
    </View>
    <View style={styles.textAreaContainer}>
      <MaterialCommunityIcons 
        name="bookmark-multiple" 
        size={18} 
        color="#6366F1" 
        style={styles.textAreaIcon} 
      />
      <TextInput
        style={styles.textAreaInput}
        placeholder="List resources separated by commas..."
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        value={resources}
        onChangeText={setResources}
      />
      {resources.length > 0 && (
        <TouchableOpacity 
          style={styles.clearTextAreaButton} 
          onPress={() => setResources('')}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  </View>

  {/* PHASE 3: REFLECTION */}
<View style={[styles.phaseHeader]}>
  <View style={styles.phaseHeaderLeft}>
    <MaterialCommunityIcons name="mirror" size={20} color="#6366F1" />
    <Text style={styles.phaseTitle}>PHASE 3: REFLECTION ACTIVITIES</Text>
  </View>
  <View style={styles.aiButtonsContainer}>
    <TouchableOpacity 
      style={styles.aiButton} 
      onPress={generateReflectionWithAI} 
      disabled={isGeneratingReflection}
    >
      {isGeneratingReflection ? (
        <ActivityIndicator size="small" color="#6366F1" />
      ) : (
        <>
          <Ionicons name="sparkles" size={14} color="#6366F1" />
          <Text style={styles.aiButtonText}>Generate</Text>
        </>
      )}
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.aiOptionsButton} 
      onPress={() => setShowAIOptionsModal(true)}
    >
      <Ionicons name="options" size={14} color="#6366F1" />
    </TouchableOpacity>
  </View>
</View>
<View style={styles.textAreaContainer}>
  <MaterialCommunityIcons 
    name="thought-bubble" 
    size={18} 
    color="#6366F1" 
    style={styles.textAreaIcon} 
  />
  <TextInput
    style={styles.textAreaInput}
    placeholder="Enter reflection activities (one per line)..."
    placeholderTextColor="#9CA3AF"
    multiline
    textAlignVertical="top"
    value={reflectionActivities}
    onChangeText={setReflectionActivities}
  />
  {reflectionActivities.length > 0 && (
    <TouchableOpacity 
      style={styles.clearTextAreaButton} 
      onPress={() => setReflectionActivities('')}
    >
      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  )}
</View>


 {/* Assessment Section */}
<View style={styles.sectionHeader}>
  <View style={styles.sectionTitleContainer}>
    <MaterialCommunityIcons name="clipboard-check" size={22} color="#6366F1" />
    <Text style={styles.sectionTitle}>Assessment</Text>
  </View>
  <View style={styles.sectionDivider} />
</View>

<View style={[styles.phaseHeader]}>
  <View style={styles.phaseHeaderLeft}>
    <MaterialCommunityIcons name="chart-box" size={20} color="#6366F1" />
    <Text style={styles.phaseTitle}>ASSESSMENT QUESTIONS</Text>
  </View>
  <View style={styles.aiButtonsContainer}>
    <TouchableOpacity 
      style={styles.aiButton} 
      onPress={generateAssessmentWithAI} 
      disabled={isGeneratingAssessment}
    >
      {isGeneratingAssessment ? (
        <ActivityIndicator size="small" color="#6366F1" />
      ) : (
        <>
          <Ionicons name="sparkles" size={14} color="#6366F1" />
          <Text style={styles.aiButtonText}>Generate</Text>
        </>
      )}
    </TouchableOpacity>
    <TouchableOpacity 
      style={styles.aiOptionsButton} 
      onPress={() => setShowAIOptionsModal(true)}
    >
      <Ionicons name="options" size={14} color="#6366F1" />
    </TouchableOpacity>
  </View>
</View>
<View style={styles.textAreaContainer}>
  <MaterialCommunityIcons 
    name="comment-question" 
    size={18} 
    color="#6366F1" 
    style={styles.textAreaIcon} 
  />
  <TextInput
    style={styles.textAreaInput}
    placeholder="Enter assessment questions (one per line)..."
    placeholderTextColor="#9CA3AF"
    multiline
    textAlignVertical="top"
    value={assessmentQuestions}
    onChangeText={setAssessmentQuestions}
  />
  {assessmentQuestions.length > 0 && (
    <TouchableOpacity 
      style={styles.clearTextAreaButton} 
      onPress={() => setAssessmentQuestions('')}
    >
      <Ionicons name="close-circle" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  )}
</View>
</View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={generateLessonNote} activeOpacity={0.9} style={styles.smallButton}>
          <LinearGradient colors={["#6366F1", "#8B5CF6"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.smallButtonInner}>
            <Ionicons name="sparkles-outline" size={14} color="white" />
            <Text style={styles.smallButtonText}>Generate</Text>
          </LinearGradient>
        </TouchableOpacity>
        {hasAnyInput && (
          <TouchableOpacity onPress={clearAllInputs} activeOpacity={0.9} style={styles.smallClearButton}>
            <LinearGradient colors={["#FEE2E2", "#FECACA"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.smallClearButtonInner}>
              <Ionicons name="trash-outline" size={14} color="#DC2626" />
              <Text style={styles.smallClearButtonText}>Clear</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showTermModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTermModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            width: '80%',
            maxHeight: '70%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: 16,
              textAlign: 'center',
            }}>Select Term</Text>
            <FlatList
              data={terms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                    alignItems: 'center',
                  }}
                  onPress={() => selectTerm(item.name)}
                >
                  <Text style={{ fontSize: 16, color: '#334155' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowTermModal(false)}
            >
              <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAIOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAIOptionsModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, width: '85%', padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12, textAlign: 'center' }}>
              AI Options
            </Text>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>Tone</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {(['Simple','Engaging','Rigorous'] as const).map((t) => (
                  <TouchableOpacity key={t} onPress={() => setAiTone(t)} style={[styles.pill, aiTone === t && styles.pillActive]}>
                    <Text style={[styles.pillText, aiTone === t && styles.pillTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>Number of activities</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[5,6,7,8].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setAiCount(n as 5|6|7|8)} style={[styles.pill, aiCount === n && styles.pillActive]}>
                    <Text style={[styles.pillText, aiCount === n && styles.pillTextActive]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>Creativity</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {([0.4,0.6,0.8] as const).map((temp) => (
                  <TouchableOpacity key={temp} onPress={() => setAiTemperature(temp)} style={[styles.pill, aiTemperature === temp && styles.pillActive]}>
                    <Text style={[styles.pillText, aiTemperature === temp && styles.pillTextActive]}>{temp}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>Model</Text>
              <TouchableOpacity onPress={() => setShowModelModal(true)} style={[styles.dateInput, { borderColor: '#C7D2FE', backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.dateText}>{modelOptions.find(m => m.id === aiModel)?.name || aiModel}</Text>
                <Ionicons name="chevron-down" size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setShowAIOptionsModal(false)} style={[styles.pill, { flex: 1, marginRight: 8, backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
                <Text style={[styles.pillText, { color: '#334155' }]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowAIOptionsModal(false); generateNewLearningWithAI(); }} style={[styles.pillActive, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.pillTextActive]}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showModelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModelModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            width: '85%',
            maxHeight: '70%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: 16,
              textAlign: 'center',
            }}>Select Model</Text>
            <FlatList
              data={modelOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                  }}
                  onPress={() => { setAiModel(item.id); setShowModelModal(false); }}
                >
                  <Text style={{ fontSize: 14, color: '#334155' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowModelModal(false)}
            >
              <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showWeekModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWeekModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            width: '80%',
            maxHeight: '70%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: 16,
              textAlign: 'center',
            }}>Select Week</Text>
            <FlatList
              data={weeksList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                    alignItems: 'center',
                  }}
                  onPress={() => selectWeek(item.name)}
                >
                  <Text style={{ fontSize: 16, color: '#334155' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowWeekModal(false)}
            >
              <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showDayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDayModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            width: '80%',
            maxHeight: '70%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#0F172A',
              marginBottom: 16,
              textAlign: 'center',
            }}>Select Day</Text>
            <FlatList
              data={daysOfWeek}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                    alignItems: 'center',
                  }}
                  onPress={() => selectDay(item.name)}
                >
                  <Text style={{ fontSize: 16, color: '#334155' }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#F3F4F6',
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setShowDayModal(false)}
            >
              <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
                 </View>
       </Modal>

       <Modal
         visible={showSubjectModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowSubjectModal(false)}
       >
         <View style={{
           flex: 1,
           backgroundColor: 'rgba(0,0,0,0.5)',
           justifyContent: 'center',
           alignItems: 'center',
         }}>
           <View style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 24,
             width: '80%',
             maxHeight: '70%',
             elevation: 5,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.25,
             shadowRadius: 4,
           }}>
             <Text style={{
               fontSize: 18,
               fontWeight: 'bold',
               color: '#0F172A',
               marginBottom: 16,
               textAlign: 'center',
             }}>Select Subject</Text>
             <FlatList
               data={subjects}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                 <TouchableOpacity
                   style={{
                     padding: 16,
                     borderBottomWidth: 1,
                     borderBottomColor: '#E5E7EB',
                     alignItems: 'center',
                   }}
                   onPress={() => selectSubject(item.name)}
                 >
                   <Text style={{ fontSize: 16, color: '#334155' }}>{item.name}</Text>
                 </TouchableOpacity>
               )}
             />
             <TouchableOpacity
               style={{
                 marginTop: 16,
                 padding: 12,
                 backgroundColor: '#F3F4F6',
                 borderRadius: 8,
                 alignItems: 'center',
               }}
               onPress={() => setShowSubjectModal(false)}
             >
               <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

       <Modal
         visible={showClassModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowClassModal(false)}
       >
         <View style={{
           flex: 1,
           backgroundColor: 'rgba(0,0,0,0.5)',
           justifyContent: 'center',
           alignItems: 'center',
         }}>
           <View style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 24,
             width: '80%',
             maxHeight: '70%',
             elevation: 5,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.25,
             shadowRadius: 4,
           }}>
             <Text style={{
               fontSize: 18,
               fontWeight: 'bold',
               color: '#0F172A',
               marginBottom: 16,
               textAlign: 'center',
             }}>Select Class</Text>
             <FlatList
               data={classLevels}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                 <TouchableOpacity
                   style={{
                     padding: 16,
                     borderBottomWidth: 1,
                     borderBottomColor: '#E5E7EB',
                     alignItems: 'center',
                   }}
                   onPress={() => selectClass(item.name)}
                 >
                   <Text style={{ fontSize: 16, color: '#334155' }}>{item.name}</Text>
                 </TouchableOpacity>
               )}
             />
             <TouchableOpacity
               style={{
                 marginTop: 16,
                 padding: 12,
                 backgroundColor: '#F3F4F6',
                 borderRadius: 8,
                 alignItems: 'center',
               }}
               onPress={() => setShowClassModal(false)}
             >
               <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

       <Modal
         visible={showCalendar}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowCalendar(false)}
       >
         <View style={{
           flex: 1,
           backgroundColor: 'rgba(0,0,0,0.5)',
           justifyContent: 'center',
           alignItems: 'center',
         }}>
           <View style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 24,
             width: '90%',
             maxHeight: '80%',
             elevation: 5,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.25,
             shadowRadius: 4,
           }}>
             <Text style={{
               fontSize: 18,
               fontWeight: 'bold',
               color: '#0F172A',
               marginBottom: 16,
               textAlign: 'center',
             }}>Select Week Ending Date</Text>
             <Calendar
               style={styles.calendar}
               theme={{
                 backgroundColor: '#ffffff',
                 calendarBackground: '#ffffff',
                 textSectionTitleColor: '#6366F1',
                 selectedDayBackgroundColor: '#6366F1',
                 selectedDayTextColor: '#ffffff',
                 todayTextColor: '#6366F1',
                 dayTextColor: '#334155',
                 textDisabledColor: '#CBD5E1',
                 arrowColor: '#6366F1',
                 monthTextColor: '#0F172A',
               }}
               onDayPress={handleDateSelect}
               markedDates={{
                 [weekEnding]: {selected: true, selectedColor: '#6366F1'}
               }}
             />
             <TouchableOpacity
               style={{
                 marginTop: 16,
                 padding: 12,
                 backgroundColor: '#F3F4F6',
                 borderRadius: 8,
                 alignItems: 'center',
               }}
               onPress={() => setShowCalendar(false)}
             >
               <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

       <Modal
         visible={showCoreCompetenciesModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowCoreCompetenciesModal(false)}
       >
         <View style={{
           flex: 1,
           backgroundColor: 'rgba(0,0,0,0.5)',
           justifyContent: 'center',
           alignItems: 'center',
         }}>
           <View style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 24,
             width: '80%',
             maxHeight: '70%',
             elevation: 5,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.25,
             shadowRadius: 4,
           }}>
             <Text style={{
               fontSize: 18,
               fontWeight: 'bold',
               color: '#0F172A',
               marginBottom: 16,
               textAlign: 'center',
             }}>Select Core Competency</Text>
             <FlatList
               data={coreCompetenciesList}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                 <TouchableOpacity
                   style={{
                     padding: 16,
                     borderBottomWidth: 1,
                     borderBottomColor: '#E5E7EB',
                     alignItems: 'center',
                   }}
                   onPress={() => selectCoreCompetency(item.name)}
                 >
                   <Text style={{ fontSize: 16, color: '#334155', textAlign: 'center' }}>{item.name}</Text>
                 </TouchableOpacity>
               )}
             />
             <TouchableOpacity
               style={{
                 marginTop: 16,
                 padding: 12,
                 backgroundColor: '#F3F4F6',
                 borderRadius: 8,
                 alignItems: 'center',
               }}
               onPress={() => setShowCoreCompetenciesModal(false)}
             >
               <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
             </TouchableOpacity>
           </View>
         </View>
       </Modal>

       <Modal
         visible={showLessonNumberModal}
         transparent={true}
         animationType="slide"
         onRequestClose={() => setShowLessonNumberModal(false)}
       >
         <View style={{
           flex: 1,
           backgroundColor: 'rgba(0,0,0,0.5)',
           justifyContent: 'center',
           alignItems: 'center',
         }}>
           <View style={{
             backgroundColor: 'white',
             borderRadius: 12,
             padding: 24,
             width: '80%',
             maxHeight: '70%',
             elevation: 5,
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.25,
             shadowRadius: 4,
           }}>
             <Text style={{
               fontSize: 18,
               fontWeight: 'bold',
               color: '#0F172A',
               marginBottom: 16,
               textAlign: 'center',
             }}>Select Lesson Number</Text>
             <FlatList
               data={lessonNumbers}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                 <TouchableOpacity
                   style={{
                     padding: 16,
                     borderBottomWidth: 1,
                     borderBottomColor: '#E5E7EB',
                     alignItems: 'center',
                   }}
                   onPress={() => selectLessonNumber(item.name)}
                 >
                   <Text style={{ fontSize: 16, color: '#334155' }}>{item.name}</Text>
                 </TouchableOpacity>
               )}
             />
             <TouchableOpacity
               style={{
                 marginTop: 16,
                 padding: 12,
                 backgroundColor: '#F3F4F6',
                 borderRadius: 8,
                 alignItems: 'center',
               }}
               onPress={() => setShowLessonNumberModal(false)}
             >
               <Text style={{ fontSize: 16, color: '#EF4444', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ScrollView>
    );
  };

  const PreviewTab = () => (
    <ScrollView style={styles.previewContainer}>
      {generatedLesson ? (
        <>
          <Text style={styles.previewTitle}>Lesson Plan Preview</Text>
          
          <View style={styles.previewCard}>
            <Text style={styles.previewHeader}>Basic Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Week Ending:</Text>
              <Text style={styles.detailValue}>{generatedLesson.weekEnding}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Day:</Text>
              <Text style={styles.detailValue}>{generatedLesson.day}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Subject:</Text>
              <Text style={styles.detailValue}>{generatedLesson.subject}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{generatedLesson.duration}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class:</Text>
              <Text style={styles.detailValue}>{generatedLesson.classLevel}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class Size:</Text>
              <Text style={styles.detailValue}>{generatedLesson.classSize}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Strand:</Text>
              <Text style={styles.detailValue}>{generatedLesson.strand}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sub-Strand:</Text>
              <Text style={styles.detailValue}>{generatedLesson.subStrand}</Text>
            </View>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewHeader}>Curriculum Standards</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Content Standard:</Text>
              <Text style={styles.detailValue}>{generatedLesson.contentStandard}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Indicator:</Text>
              <Text style={styles.detailValue}>{generatedLesson.indicator}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Lesson Number:</Text>
              <Text style={styles.detailValue}>{generatedLesson.lessonNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Performance Indicator:</Text>
              <Text style={styles.detailValue}>{generatedLesson.performanceIndicator}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Core Competencies:</Text>
              <Text style={styles.detailValue}>{generatedLesson.coreCompetencies}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>References:</Text>
              <Text style={styles.detailValue}>{generatedLesson.references}</Text>
            </View>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewHeader}>Lesson Phases</Text>
            
            <Text style={styles.phaseTitle}>PHASE 1: STARTER</Text>
            {generatedLesson.starterActivities
              .split('\n')
              .filter(line => line.trim())
              .map((activity, i) => (
              <Text key={i} style={styles.activityText}>• {activity}</Text>
            ))}

            <Text style={styles.phaseTitle}>PHASE 2: NEW LEARNING</Text>
            {generatedLesson.newLearningActivities
              .split('\n')
              .filter(line => line.trim())
              .map((activity, i) => (
              <Text key={i} style={styles.activityText}>• {activity}</Text>
            ))}

            <Text style={styles.detailLabel}>Resources:</Text>
            <Text style={styles.detailValue}>{generatedLesson.resources}</Text>

            <Text style={styles.phaseTitle}>PHASE 3: REFLECTION</Text>
            {generatedLesson.reflectionActivities
              .split('\n')
              .filter(line => line.trim())
              .map((activity, i) => (
              <Text key={i} style={styles.activityText}>• {activity}</Text>
            ))}
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewHeader}>Assessment</Text>
            {generatedLesson.assessmentQuestions
              .split('\n')
              .filter(line => line.trim())
              .map((question, i) => (
              <Text key={i} style={styles.activityText}>• {question}</Text>
            ))}
          </View>

          <View style={styles.exportButtonsContainer}>
            <TouchableOpacity 
              style={[styles.exportButton, styles.pdfButton]}
              onPress={exportToPDF}
            >
              <MaterialCommunityIcons name="file-pdf-box" size={20} color="white" />
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.exportButton, styles.wordButton]}
              onPress={exportToWord}
            >
              <MaterialCommunityIcons name="file-word" size={20} color="white" />
              <Text style={styles.exportButtonText}>Export Word</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setActiveTab('create')}
          >
            <Text style={styles.editButtonText}>Edit Lesson</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyPreview}>
          <Image 
            // source={require('../assets/empty-lesson.png')} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No lesson generated yet</Text>
          <Text style={styles.emptySubtext}>Create a lesson plan to see the preview</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setActiveTab('create')}
          >
            <Text style={styles.createButtonText}>Create Lesson</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return CreateTab();
      case 'preview':
        return PreviewTab();
      default:
        return CreateTab();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <LinearGradient colors={['#F8FAFC', '#EFF6FF']} style={styles.container}>
        {renderContent()}
      </LinearGradient>
      
      <View style={styles.tabBar}>
  {/* Create Tab */}
  <TouchableOpacity 
    style={styles.tabItem}
    onPress={() => setActiveTab('create')}
  >
    <View style={[
      styles.tabIconContainer,
      activeTab === 'create' && styles.activeTabIconContainer
    ]}>
      <LinearGradient
        colors={activeTab === 'create' ? ['#6366F1', '#8B5CF6'] : ['transparent', 'transparent']}
        style={styles.tabIconGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons 
          name="file-edit-outline" 
          size={24} 
          color={activeTab === 'create' ? 'white' : '#94A3B8'} 
        />
      </LinearGradient>
    </View>
    <Text style={[
      styles.tabText, 
      activeTab === 'create' && styles.activeTabText
    ]}>
      Create
    </Text>
    {activeTab === 'create' && <View style={styles.activeTabIndicator}/>}
  </TouchableOpacity>

  {/* Preview Tab */}
  <TouchableOpacity 
    style={styles.tabItem}
    onPress={() => setActiveTab('preview')}
  >
    <View style={[
      styles.tabIconContainer,
      activeTab === 'preview' && styles.activeTabIconContainer
    ]}>
      <LinearGradient
        colors={activeTab === 'preview' ? ['#6366F1', '#8B5CF6'] : ['transparent', 'transparent']}
        style={styles.tabIconGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons 
          name="file-eye-outline" 
          size={24} 
          color={activeTab === 'preview' ? 'white' : '#94A3B8'} 
        />
      </LinearGradient>
    </View>
    <Text style={[
      styles.tabText, 
      activeTab === 'preview' && styles.activeTabText
    ]}>
      Preview
    </Text>
    {activeTab === 'preview' && <View style={styles.activeTabIndicator}/>}
  </TouchableOpacity>
</View>
    </KeyboardAvoidingView>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  dayItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#334155',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginBottom: 70,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    color: '#0F172A',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#0F172A',
  },
  placeholderText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  calendar: {
    marginTop: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  col: {
    flex: 1,
    marginHorizontal: 8,
  },
  phaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiGenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  aiGenButtonText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  smallButton: {
    borderRadius: 999,
    overflow: 'hidden',
    marginHorizontal: 6,
  },
  smallButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  smallButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  clearButton: {
    marginTop: 16,
    marginLeft: 6,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  clearButtonTop: {
    marginTop: 0,
    marginLeft: 0,
    alignSelf: 'auto',
  },
  clearButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  clearButtonInnerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  clearButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  smallClearButton: {
    borderRadius: 999,
    overflow: 'hidden',
    marginHorizontal: 6,
  },
  smallClearButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: 'transparent',
  },
  smallClearButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  clearButtonTextSmall: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 6,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    position: 'relative',
  },
  tabIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabIconContainer: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#475569',
    width: 120,
  },
  detailValue: {
    color: '#0F172A',
    flex: 1,
  },
  activityText: {
    color: '#0F172A',
    marginBottom: 8,
    marginLeft: 8,
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  pdfButton: {
    backgroundColor: '#E53E3E',
  },
  wordButton: {
    backgroundColor: '#2B579A',
  },
  exportButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
  },
  pillActive: { 
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  pillText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  pillTextActive: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 8,
    borderColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  headerContainer: {
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  headerCurve: {
    position: 'absolute',
    bottom: -40,
    left: -50,
    right: -50,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: 1,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 3,
    width: 50,
    backgroundColor: '#6366F1',
    borderRadius: 3,
    opacity: 0.5,
  },
  gridContainer: {
    marginHorizontal: -8,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  selectInputText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  selectInputPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
    marginLeft: 8,
  },
  inputIcon: {
    marginRight: 4,
  },
  textInputContainer: {
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  textInput: {
    paddingVertical: 12,
    paddingLeft: 42,
    paddingRight: 36,
    fontSize: 14,
    color: '#1F2937',
  },
  textInputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  clearInputButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  inputFieldContainer: {
    marginBottom: 16,
  },
textAreaContainer: {
  position: 'relative',
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 12,
  minHeight: 100,
},
  textAreaIcon: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 1,
  },
  textAreaInput: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 42,
    paddingRight: 36,
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
  },
  clearTextAreaButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    padding: 4,
  },
  phaseContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 20, // Consistent spacing between phases
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
phaseHeaderLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
newLearningHeader: {
  backgroundColor: '#F5F3FF',
  padding: 10,
  borderRadius: 8,
  marginLeft: -10,
  marginRight: -10,
  marginTop: -10,
  marginBottom: 10,
},
phaseTitle: {
  fontSize: 17,
  fontWeight: '700',
  color: '#1F2937',
  marginLeft: 8,
  letterSpacing: 0.5,
},
aiButtonsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
aiButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EDE9FE',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  marginRight: 8,
},
aiOptionsButton: {
  backgroundColor: '#EDE9FE',
  padding: 6,
  borderRadius: 8,
},
aiButtonText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#6366F1',
  marginLeft: 4,
},
assessmentContainer: {
  marginBottom: 300, // Gives extra space when keyboard appears
  paddingBottom: 50, // Additional padding
}
});


Object.assign(styles, modalStyles);
