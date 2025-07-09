import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Dumbbell, Target, Zap, ChevronLeft, Clock, Edit3 } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { getAllTemplates, getTemplateById, type WorkoutTemplate } from '../data/workoutTemplates';
import { generateWorkoutPlan, getAllAvailableEquipment, getEquipmentDisplayName, getVolumeDisplayInfo, type GenerationOptions, type VolumeLevel } from '../lib/planGenerationEngine';
import { useUserProfile } from '../hooks/useUserProfile';
import { getEnhancedExercise } from '../data/workoutData';

interface PlanGenerationWizardProps {
  onBack: () => void;
  onPlanGenerated: (planId: string) => void;
}

type WizardStep = 'template' | 'volume' | 'equipment' | 'generation' | 'confirmation';

export function PlanGenerationWizard({ onBack, onPlanGenerated }: PlanGenerationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<VolumeLevel>('standard');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['bodyweight']); // Default to bodyweight
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [planName, setPlanName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startGeneratedPlan } = useUserProfile();

  const availableTemplates = getAllTemplates();
  const availableEquipment = getAllAvailableEquipment();
  const volumeOptions: VolumeLevel[] = ['short', 'standard', 'long'];

  const handleTemplateSelect = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setPlanName(`My ${template.name}`); // Set default name
    setCurrentStep('volume');
  };

  const handleVolumeSelect = (volume: VolumeLevel) => {
    setSelectedVolume(volume);
    setCurrentStep('equipment');
  };

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipment)) {
        // Don't allow removing bodyweight - it's always available
        if (equipment === 'bodyweight') return prev;
        return prev.filter(e => e !== equipment);
      } else {
        return [...prev, equipment];
      }
    });
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setError(null);

    try {
      const options: GenerationOptions = {
        templateId: selectedTemplate.id,
        selectedEquipment,
        volume: selectedVolume,
        planName: planName || `My ${selectedTemplate.name}`
      };

      const generated = generateWorkoutPlan(options);
      
      if (!generated) {
        throw new Error('Failed to generate plan. Please check your equipment selection.');
      }

      setGeneratedPlan(generated);
      setCurrentStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartPlan = async () => {
    if (!generatedPlan) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create the final plan with user's custom name
      const finalPlan = {
        ...generatedPlan,
        name: planName.trim() || generatedPlan.name,
        id: `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Ensure unique ID
      };
      
      console.log('Saving generated plan:', finalPlan);
      
      // Save the plan to the database
      const savedProfile = await startGeneratedPlan(finalPlan);
      
      if (!savedProfile) {
        throw new Error('Failed to save plan to database');
      }
      
      console.log('Plan saved successfully:', savedProfile);
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return to plans screen instead of navigating to the generated plan
      onBack();
    } catch (err) {
      console.error('Error saving generated plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to start plan');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedFromEquipment = selectedEquipment.length > 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <IconButton onClick={onBack} ariaLabel="Back to Plans" className="text-sm">
          <ChevronLeft size={20} className="mr-1" /> Back to Plans
        </IconButton>
        <div className="text-center flex-1 mx-4">
          <h2 className="text-3xl font-bold text-theme-gold">Create Your Own Plan</h2>
          <p className="text-theme-gold-dark mt-2">Generate a personalized workout plan</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-theme-black-light border border-theme-gold/20">
        <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
              currentStep === 'template' ? 'bg-theme-gold text-theme-black' : 
              ['volume', 'equipment', 'generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold/20 text-theme-gold' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              1
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              currentStep === 'template' ? 'text-theme-gold' : 
              ['volume', 'equipment', 'generation', 'confirmation'].includes(currentStep) ? 'text-theme-gold-light' : 
              'text-theme-gold-dark'
            }`}>
              Template
            </span>
          </div>
          
          <div className={`h-1 w-6 md:w-12 flex-shrink-0 ${
            ['volume', 'equipment', 'generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold' : 'bg-theme-black-lighter'
          }`} />
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
              currentStep === 'volume' ? 'bg-theme-gold text-theme-black' : 
              ['equipment', 'generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold/20 text-theme-gold' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              2
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              currentStep === 'volume' ? 'text-theme-gold' : 
              ['equipment', 'generation', 'confirmation'].includes(currentStep) ? 'text-theme-gold-light' : 
              'text-theme-gold-dark'
            }`}>
              Length
            </span>
          </div>
          
          <div className={`h-1 w-6 md:w-12 flex-shrink-0 ${
            ['equipment', 'generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold' : 'bg-theme-black-lighter'
          }`} />
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
              currentStep === 'equipment' ? 'bg-theme-gold text-theme-black' : 
              ['generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold/20 text-theme-gold' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              3
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              currentStep === 'equipment' ? 'text-theme-gold' : 
              ['generation', 'confirmation'].includes(currentStep) ? 'text-theme-gold-light' : 
              'text-theme-gold-dark'
            }`}>
              Equipment
            </span>
          </div>
          
          <div className={`h-1 w-6 md:w-12 flex-shrink-0 ${
            ['generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold' : 'bg-theme-black-lighter'
          }`} />
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
              ['generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold text-theme-black' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              4
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              ['generation', 'confirmation'].includes(currentStep) ? 'text-theme-gold' : 
              'text-theme-gold-dark'
            }`}>
              Generate
            </span>
          </div>
        </div>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 'template' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-theme-gold mb-2">Choose Your Training Goal</h3>
              <p className="text-theme-gold-dark">Select a template that matches your fitness objectives.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {availableTemplates.map(template => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:border-theme-gold/50 hover:scale-[1.02] ${
                    selectedTemplate?.id === template.id ? 'border-theme-gold bg-theme-gold/10' : 'border-theme-gold/20'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-theme-gold/20 rounded-nested-container flex items-center justify-center">
                      <Target className="w-8 h-8 text-theme-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-theme-gold">{template.name}</h4>
                      <p className="text-theme-gold-dark mb-3">{template.description}</p>
                      <div className="flex items-center text-theme-gold-dark text-sm">
                        <span>{template.daysPerWeek} days per week</span>
                        <span className="mx-2">•</span>
                        <span>{template.workouts.length} unique workouts</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'volume' && selectedTemplate && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-theme-gold mb-2">Select Workout Length</h3>
              <p className="text-theme-gold-dark">Choose the duration that fits your schedule and goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {volumeOptions.map(volume => {
                const volumeInfo = getVolumeDisplayInfo(volume);
                return (
                  <Card
                    key={volume}
                    className={`cursor-pointer transition-all duration-200 hover:border-theme-gold/50 hover:scale-[1.02] ${
                      selectedVolume === volume ? 'border-theme-gold bg-theme-gold/10' : 'border-theme-gold/20'
                    }`}
                    onClick={() => handleVolumeSelect(volume)}
                  >
                    <div className="text-center space-y-3 p-4">
                      <div className={`w-16 h-16 mx-auto rounded-nested-container flex items-center justify-center ${
                        selectedVolume === volume ? 'bg-theme-gold text-theme-black' : 'bg-theme-gold/20'
                      }`}>
                        <Clock className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-theme-gold">{volumeInfo.name}</h4>
                        <p className="text-theme-gold-light text-sm font-medium">{volumeInfo.duration}</p>
                      </div>
                      <p className="text-theme-gold-dark text-sm">{volumeInfo.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <IconButton
                onClick={() => setCurrentStep('template')}
                ariaLabel="Back to Templates"
                className="flex-1"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </IconButton>
              <PrimaryButton
                onClick={() => setCurrentStep('equipment')}
                ariaLabel="Continue to Equipment"
                className="flex-1"
              >
                Continue
                <ArrowRight size={16} className="ml-1" />
              </PrimaryButton>
            </div>
          </div>
        )}

        {currentStep === 'equipment' && selectedTemplate && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-theme-gold mb-2">Select Your Equipment</h3>
              <p className="text-theme-gold-dark">Choose all the equipment you have available for training.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableEquipment.map(equipment => (
                <Card
                  key={equipment}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedEquipment.includes(equipment) 
                      ? 'border-theme-gold bg-theme-gold/10' 
                      : 'border-theme-gold/20 hover:border-theme-gold/50'
                  } ${equipment === 'bodyweight' ? 'opacity-100' : ''}`}
                  onClick={() => handleEquipmentToggle(equipment)}
                >
                  <div className="flex flex-col items-center space-y-2 text-center p-2">
                    <div className={`w-8 h-8 rounded-2x-nested-container flex items-center justify-center ${
                      selectedEquipment.includes(equipment) ? 'bg-theme-gold text-theme-black' : 'bg-theme-black-lighter'
                    }`}>
                      {selectedEquipment.includes(equipment) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-theme-gold-dark" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      selectedEquipment.includes(equipment) ? 'text-theme-gold' : 'text-theme-gold-dark'
                    }`}>
                      {getEquipmentDisplayName(equipment)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-sm text-theme-gold-dark text-center">
              <p>💡 Bodyweight is always included and cannot be removed</p>
            </div>

            <div className="flex gap-3 pt-4">
              <IconButton
                onClick={() => setCurrentStep('volume')}
                ariaLabel="Back to Volume"
                className="flex-1"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </IconButton>
              <PrimaryButton
                onClick={() => setCurrentStep('generation')}
                ariaLabel="Generate Plan"
                className="flex-1"
                disabled={!canProceedFromEquipment}
              >
                Generate Plan
                <ArrowRight size={16} className="ml-1" />
              </PrimaryButton>
            </div>
          </div>
        )}

        {currentStep === 'generation' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-theme-gold mb-2">Generate Your Plan</h3>
              <p className="text-theme-gold-dark">Ready to create your personalized workout plan?</p>
            </div>

            {selectedTemplate && (
              <Card className="bg-theme-black-lighter border-theme-gold/20">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-lg font-semibold text-theme-gold">Template: {selectedTemplate.name}</h4>
                    <p className="text-theme-gold-dark">{selectedTemplate.description}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-theme-gold">Workout Length: {getVolumeDisplayInfo(selectedVolume).name}</h4>
                    <p className="text-theme-gold-dark">{getVolumeDisplayInfo(selectedVolume).description} ({getVolumeDisplayInfo(selectedVolume).duration})</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-theme-gold">Equipment Selected:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEquipment.map(equipment => (
                        <span 
                          key={equipment}
                          className="px-2 py-1 bg-theme-gold/20 text-theme-gold text-xs rounded-2x-nested-container"
                        >
                          {getEquipmentDisplayName(equipment)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-nested-container">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <IconButton
                onClick={() => setCurrentStep('equipment')}
                ariaLabel="Back to Equipment"
                className="flex-1"
                disabled={isGenerating}
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </IconButton>
              <PrimaryButton
                onClick={handleGenerate}
                ariaLabel="Generate Plan"
                className="flex-1"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-theme-black mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={16} className="mr-1" />
                    Generate Plan
                  </>
                )}
              </PrimaryButton>
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && generatedPlan && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-theme-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-gold"></div>
                </div>
                <h3 className="text-2xl font-bold text-theme-gold mb-2">Generating your plan...</h3>
                <p className="text-theme-gold-dark">Setting up your personalized workout program</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-20 h-20 bg-theme-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-theme-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-theme-gold mb-2">Plan Generated Successfully!</h3>
                  <p className="text-theme-gold-dark">Your personalized workout plan is ready to start.</p>
                </div>

                <Card className="bg-theme-gold/10 border-theme-gold/30">
                  <div className="space-y-4">
                    {/* Plan Name Input */}
                    <div>
                      <label htmlFor="planName" className="block text-sm font-medium text-theme-gold mb-2">
                        Plan Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="planName"
                          value={planName}
                          onChange={(e) => setPlanName(e.target.value)}
                          className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                          placeholder="Enter a name for your plan"
                          disabled={isLoading}
                        />
                        <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-theme-gold-dark" />
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-theme-gold/20">
                      <p className="text-theme-gold-dark text-lg">{generatedPlan.description}</p>
                      
                      <div className="space-y-4 mt-6">
                        <h5 className="font-semibold text-theme-gold">Workout Schedule:</h5>
                        <div className="space-y-3">
                          {Object.entries(generatedPlan.levels[0].workouts).map(([day, workout]: [string, any]) => (
                            <div key={day} className="bg-theme-black-lighter rounded-nested-container p-4 border border-theme-gold/20">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h6 className="font-semibold text-theme-gold">{day}</h6>
                                  <p className="text-sm text-theme-gold-light">{workout.name.split(' - ')[1] || workout.name}</p>
                                </div>
                                <span className="text-xs text-theme-gold-dark bg-theme-gold/20 px-2 py-1 rounded-2x-nested-container">
                                  {workout.exercises.length} exercises
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <h7 className="text-xs font-medium text-theme-gold-dark uppercase tracking-wide">Exercises:</h7>
                                <div className="grid grid-cols-1 gap-1">
                                  {workout.exercises.map((exercise: any, index: number) => {
                                    const enhancedExercise = getEnhancedExercise(exercise);
                                    return (
                                      <div key={index} className="flex justify-between items-center text-xs">
                                        <span className="text-theme-gold-light">{enhancedExercise.name}</span>
                                        <span className="text-theme-gold-dark">{exercise.sets} × {exercise.reps}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                          </div>
                    </div>
                  </div>
                </Card>

                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-nested-container">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <SecondaryButton
                    onClick={() => setCurrentStep('generation')}
                    ariaLabel="Generate Different Plan"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Generate Different Plan
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleStartPlan}
                    ariaLabel="Save Plan"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Save Plan
                  </PrimaryButton>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}