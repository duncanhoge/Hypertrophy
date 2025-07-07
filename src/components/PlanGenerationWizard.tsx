import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Dumbbell, Target, Zap } from 'lucide-react';
import { Modal } from './ui/Modal';
import { PrimaryButton, SecondaryButton } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { getAllTemplates, getTemplateById, type WorkoutTemplate } from '../data/workoutTemplates';
import { generateWorkoutPlan, getAllAvailableEquipment, getEquipmentDisplayName, type GenerationOptions } from '../lib/planGenerationEngine';
import { useUserProfile } from '../hooks/useUserProfile';

interface PlanGenerationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (planId: string) => void;
}

type WizardStep = 'template' | 'equipment' | 'generation' | 'confirmation';

export function PlanGenerationWizard({ isOpen, onClose, onPlanGenerated }: PlanGenerationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['bodyweight']); // Default to bodyweight
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startGeneratedPlan } = useUserProfile();

  const availableTemplates = getAllTemplates();
  const availableEquipment = getAllAvailableEquipment();

  const handleTemplateSelect = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
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
        planName: `My ${selectedTemplate.name}`
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

    try {
      await startGeneratedPlan(generatedPlan);
      onPlanGenerated(generatedPlan.id);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start plan');
    }
  };

  const handleClose = () => {
    setCurrentStep('template');
    setSelectedTemplate(null);
    setSelectedEquipment(['bodyweight']);
    setGeneratedPlan(null);
    setError(null);
    onClose();
  };

  const canProceedFromEquipment = selectedEquipment.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Your Own Plan">
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === 'template' ? 'bg-theme-gold text-theme-black' : 
              ['equipment', 'generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold/20 text-theme-gold' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              1
            </div>
            <div className={`h-1 w-8 ${
              ['equipment', 'generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold' : 'bg-theme-black-lighter'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep === 'equipment' ? 'bg-theme-gold text-theme-black' : 
              ['generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold/20 text-theme-gold' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              2
            </div>
            <div className={`h-1 w-8 ${
              ['generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold' : 'bg-theme-black-lighter'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              ['generation', 'confirmation'].includes(currentStep) ? 'bg-theme-gold text-theme-black' : 
              'bg-theme-black-lighter text-theme-gold-dark'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'template' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-theme-gold mb-2">Choose Your Training Goal</h3>
              <p className="text-theme-gold-dark">Select a template that matches your fitness objectives.</p>
            </div>
            
            <div className="space-y-3">
              {availableTemplates.map(template => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover:border-theme-gold/50 ${
                    selectedTemplate?.id === template.id ? 'border-theme-gold bg-theme-gold/10' : 'border-theme-gold/20'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-theme-gold/20 rounded-nested-container flex items-center justify-center">
                      <Target className="w-6 h-6 text-theme-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-theme-gold">{template.name}</h4>
                      <p className="text-theme-gold-dark text-sm mb-2">{template.description}</p>
                      <div className="flex items-center text-theme-gold-dark text-xs">
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

        {currentStep === 'equipment' && selectedTemplate && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-theme-gold mb-2">Select Your Equipment</h3>
              <p className="text-theme-gold-dark">Choose all the equipment you have available for training.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-2x-nested-container flex items-center justify-center ${
                      selectedEquipment.includes(equipment) ? 'bg-theme-gold text-theme-black' : 'bg-theme-black-lighter'
                    }`}>
                      {selectedEquipment.includes(equipment) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-theme-gold-dark" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      selectedEquipment.includes(equipment) ? 'text-theme-gold' : 'text-theme-gold-dark'
                    }`}>
                      {getEquipmentDisplayName(equipment)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-xs text-theme-gold-dark text-center">
              <p>💡 Bodyweight is always included and cannot be removed</p>
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
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-theme-gold mb-2">Generate Your Plan</h3>
              <p className="text-theme-gold-dark">Ready to create your personalized workout plan?</p>
            </div>

            {selectedTemplate && (
              <Card className="bg-theme-black-lighter border-theme-gold/20">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-theme-gold">Template: {selectedTemplate.name}</h4>
                    <p className="text-sm text-theme-gold-dark">{selectedTemplate.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-theme-gold">Equipment Selected:</h4>
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
                <p className="text-red-400 text-sm">{error}</p>
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
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-theme-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-theme-gold" />
              </div>
              <h3 className="text-xl font-bold text-theme-gold mb-2">Plan Generated Successfully!</h3>
              <p className="text-theme-gold-dark">Your personalized workout plan is ready to start.</p>
            </div>

            <Card className="bg-theme-gold/10 border-theme-gold/30">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-theme-gold">{generatedPlan.name}</h4>
                <p className="text-theme-gold-dark">{generatedPlan.description}</p>
                
                <div className="space-y-2">
                  <h5 className="font-semibold text-theme-gold">Workout Schedule:</h5>
                  {Object.entries(generatedPlan.levels[0].workouts).map(([day, workout]: [string, any]) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="text-theme-gold-light">{day}</span>
                      <span className="text-theme-gold-dark">{workout.exercises.length} exercises</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-nested-container">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <SecondaryButton
                onClick={() => setCurrentStep('generation')}
                ariaLabel="Generate Different Plan"
                className="flex-1"
              >
                Generate Different Plan
              </SecondaryButton>
              <PrimaryButton
                onClick={handleStartPlan}
                ariaLabel="Start This Plan"
                className="flex-1"
              >
                <CheckCircle size={16} className="mr-1" />
                Start This Plan
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}