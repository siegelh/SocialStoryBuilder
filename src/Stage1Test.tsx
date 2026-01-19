import React from 'react';
import { SOCIAL_STORY_TEMPLATES, getTemplatesByCategory } from './data/templates';

/**
 * Test component to verify Stage 1 is working
 * This will be replaced with the actual ScenarioSelector
 */
function Stage1Test() {
    const medicalTemplates = getTemplatesByCategory('medical');
    const schoolTemplates = getTemplatesByCategory('school');
    const dailyTemplates = getTemplatesByCategory('daily-routine');
    const travelTemplates = getTemplatesByCategory('travel');
    const socialTemplates = getTemplatesByCategory('social');

    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
            <h1>🎯 Stage 1 Test: Templates Loaded Successfully!</h1>
            <p>Total templates: {SOCIAL_STORY_TEMPLATES.length}</p>

            <div style={{ marginTop: '2rem' }}>
                <h2>📋 Medical Scenarios ({medicalTemplates.length})</h2>
                {medicalTemplates.map(t => (
                    <div key={t.id} style={{ padding: '1rem', margin: '0.5rem 0', background: '#f0f9ff', borderRadius: '8px' }}>
                        <h3>{t.icon} {t.title}</h3>
                        <p>{t.description}</p>
                        <small>Ages {t.ageRange[0]}-{t.ageRange[1]} | {t.estimatedScenes} scenes</small>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>🏫 School Scenarios ({schoolTemplates.length})</h2>
                {schoolTemplates.map(t => (
                    <div key={t.id} style={{ padding: '1rem', margin: '0.5rem 0', background: '#fef3c7', borderRadius: '8px' }}>
                        <h3>{t.icon} {t.title}</h3>
                        <p>{t.description}</p>
                        <small>Ages {t.ageRange[0]}-{t.ageRange[1]} | {t.estimatedScenes} scenes</small>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>🏠 Daily Routines ({dailyTemplates.length})</h2>
                {dailyTemplates.map(t => (
                    <div key={t.id} style={{ padding: '1rem', margin: '0.5rem 0', background: '#f0fdf4', borderRadius: '8px' }}>
                        <h3>{t.icon} {t.title}</h3>
                        <p>{t.description}</p>
                        <small>Ages {t.ageRange[0]}-{t.ageRange[1]} | {t.estimatedScenes} scenes</small>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>✈️ Travel Scenarios ({travelTemplates.length})</h2>
                {travelTemplates.map(t => (
                    <div key={t.id} style={{ padding: '1rem', margin: '0.5rem 0', background: '#fce7f3', borderRadius: '8px' }}>
                        <h3>{t.icon} {t.title}</h3>
                        <p>{t.description}</p>
                        <small>Ages {t.ageRange[0]}-{t.ageRange[1]} | {t.estimatedScenes} scenes</small>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>🎉 Social Events ({socialTemplates.length})</h2>
                {socialTemplates.map(t => (
                    <div key={t.id} style={{ padding: '1rem', margin: '0.5rem 0', background: '#ede9fe', borderRadius: '8px' }}>
                        <h3>{t.icon} {t.title}</h3>
                        <p>{t.description}</p>
                        <small>Ages {t.ageRange[0]}-{t.ageRange[1]} | {t.estimatedScenes} scenes</small>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#dcfce7', borderRadius: '8px', border: '2px solid #16a34a' }}>
                <h2>✅ Stage 1 Complete!</h2>
                <p>All templates are loaded and categorized correctly.</p>
                <p><strong>Next:</strong> Create ScenarioSelector component (Stage 2)</p>
            </div>
        </div>
    );
}

export default Stage1Test;
