
import React, { useState, useEffect } from 'react';
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
  FlatList
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
  { id: '9', name: 'OWOP' },
  { id: '10', name: 'History' },
];

const classLevels = [
  { id: '1', name: 'Basic 1' },
  { id: '2', name: 'Basic 2' },
  { id: '3', name: 'Basic 3' },
  { id: '4', name: 'Basic 4' },
  { id: '5', name: 'Basic 5' },
  { id: '6', name: 'Basic 6' },
  { id: '7', name: 'Basic 7' },
  { id: '8', name: 'Basic 8' },
  { id: '9', name: 'Basic 9' },
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

export default function GeneratorScreen() {
  const [weekEnding, setWeekEnding] = useState('');
  const [day, setDay] = useState('');
  const [showDayModal, setShowDayModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showCoreCompetenciesModal, setShowCoreCompetenciesModal] = useState(false);
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

  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [generatedLesson, setGeneratedLesson] = useState(null);
  const [showLessonNumberModal, setShowLessonNumberModal] = useState(false);

  const handleDateSelect = (day) => {
    setWeekEnding(day.dateString);
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

  const generateLessonNote = () => {
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
          <h1>FIRST TERM</h1>
          <h2>WEEKLY LESSON NOTES</h2>
          <h3>WEEK 1</h3>
          
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

  const CreateTab = () => (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Image 
          // source={require('../assets/lesson-plan-icon.png')} 
          style={styles.headerIcon}
        />
        <Text style={styles.title}>Create Weekly Lesson Note</Text>
        <Text style={styles.subtitle}>Start creating your lesson plans</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Week Ending</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={toggleCalendar}
            >
              <Text style={weekEnding ? styles.dateText : styles.placeholderText}>
                {weekEnding || 'Select date'}
              </Text>
              <Ionicons name="calendar" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Day</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowDayModal(true)}
            >
              <Text style={day ? styles.dateText : styles.placeholderText}>
                {day || 'Select day'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Subject</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowSubjectModal(true)}
            >
              <Text style={subject ? styles.dateText : styles.placeholderText}>
                {subject || 'Select subject'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Duration</Text>
            <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
                placeholder="E.g. 45mins"
              placeholderTextColor="#94A3B8"
              value={duration || ''}
              onChangeText={setDuration}
            />
              {duration.length > 0 && (
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 10, top: 10 }} 
                  onPress={() => setDuration('')}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Class</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowClassModal(true)}
            >
              <Text style={classLevel ? styles.dateText : styles.placeholderText}>
                {classLevel || 'Select basic'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Class Size</Text>
            <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="E.g. 30"
              placeholderTextColor="#94A3B8"
              value={classSize || ''}
              onChangeText={setClassSize}
              keyboardType="numeric"
            />
              {classSize.length > 0 && (
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 10, top: 10 }} 
                  onPress={() => setClassSize('')}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Strand</Text>
            <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
                placeholder="Type strand"
              placeholderTextColor="#94A3B8"
              value={strand || ''}
              onChangeText={setStrand}
            />
              {strand.length > 0 && (
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 10, top: 10 }} 
                  onPress={() => setStrand('')}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Sub-Strand</Text>
            <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
                placeholder="Type sub-strand"
              placeholderTextColor="#94A3B8"
              value={subStrand || ''}
              onChangeText={setSubStrand}
            />
              {subStrand.length > 0 && (
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 10, top: 10 }} 
                  onPress={() => setSubStrand('')}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Curriculum Standards</Text>
        
        <Text style={styles.label}>Content Standard</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter content standard..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={contentStandard || ''}
          onChangeText={setContentStandard}
        />
          {contentStandard.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setContentStandard('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Indicator</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter indicator..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={indicator || ''}
          onChangeText={setIndicator}
        />
          {indicator.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setIndicator('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Lesson Number</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowLessonNumberModal(true)}
            >
              <Text style={lessonNumber ? styles.dateText : styles.placeholderText}>
                {lessonNumber || 'Select lesson number'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Performance Indicator</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter performance indicator..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={performanceIndicator || ''}
          onChangeText={setPerformanceIndicator}
        />
          {performanceIndicator.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setPerformanceIndicator('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Core Competencies</Text>
        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => setShowCoreCompetenciesModal(true)}
        >
          <Text style={coreCompetencies ? styles.dateText : styles.placeholderText}>
            {coreCompetencies || 'Select core competency'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6366F1" />
        </TouchableOpacity>

        <Text style={styles.label}>References</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder="E.g. Science Curriculum Pg."
          placeholderTextColor="#94A3B8"
          value={references || ''}
          onChangeText={setReferences}
        />
          {references.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setReferences('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Lesson Phases</Text>
        
        <Text style={styles.phaseTitle}>PHASE 1: STARTER</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter starter activities (one per line)..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={starterActivities || ''}
            onChangeText={setStarterActivities}
          />
          {starterActivities.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setStarterActivities('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.phaseTitle}>PHASE 2: NEW LEARNING</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter new learning activities (one per line)..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={newLearningActivities || ''}
            onChangeText={setNewLearningActivities}
          />
          {newLearningActivities.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setNewLearningActivities('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Resources</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="List resources separated by commas..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={resources || ''}
          onChangeText={setResources}
        />
          {resources.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setResources('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.phaseTitle}>PHASE 3: REFLECTION</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter reflection activities (one per line)..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={reflectionActivities || ''}
            onChangeText={setReflectionActivities}
          />
          {reflectionActivities.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setReflectionActivities('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assessment</Text>
        <View style={{ position: 'relative' }}>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter assessment questions (one per line)..."
          placeholderTextColor="#94A3B8"
          multiline
            textAlignVertical="top"
            value={assessmentQuestions || ''}
            onChangeText={setAssessmentQuestions}
          />
          {assessmentQuestions.length > 0 && (
            <TouchableOpacity 
              style={{ position: 'absolute', right: 10, top: 10 }} 
              onPress={() => setAssessmentQuestions('')}
            >
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.generateButton}>
        <TouchableOpacity onPress={generateLessonNote}>
          <LinearGradient colors={["#6366F1", "#4F46E5"]} style={styles.gradientButton}>
            <Text style={styles.generateButtonText}>Generate Lesson</Text>
            <Ionicons name="arrow-forward-circle" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

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
        return <CreateTab />;
      case 'preview':
        return <PreviewTab />;
      default:
        return <CreateTab />;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
    >
      <LinearGradient colors={['#F8FAFC', '#EFF6FF']} style={styles.container}>
        {renderContent()}
      </LinearGradient>
      
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'create' && styles.activeTab]}
          onPress={() => setActiveTab('create')}
        >
          <MaterialCommunityIcons 
            name={activeTab === 'create' ? 'file-edit' : 'file-edit-outline'} 
            size={24} 
            color={activeTab === 'create' ? '#6366F1' : '#64748B'} 
          />
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            Create
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'preview' && styles.activeTab]}
          onPress={() => setActiveTab('preview')}
        >
          <MaterialCommunityIcons 
            name={activeTab === 'preview' ? 'file-eye' : 'file-eye-outline'} 
            size={24} 
            color={activeTab === 'preview' ? '#6366F1' : '#64748B'} 
          />
          <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>
            Preview
          </Text>
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
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366F1',
    marginTop: 8,
    marginBottom: 12,
  },
  generateButton: {
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
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
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: 70,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabText: {
    color: '#6366F1',
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
});

Object.assign(styles, modalStyles);