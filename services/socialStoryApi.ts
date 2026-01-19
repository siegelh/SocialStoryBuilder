import { SocialStoryScene, SocialStoryTemplate, CustomScenarioInput, ImageGenerationResult } from '../src/types';
import { AZURE_CONFIG } from '../config';

// ============================================================================
// SOCIAL STORY TEXT GENERATION
// ============================================================================

export const generateSocialStoryScene = async (
    sceneNumber: number,
    totalScenes: number,
    template: SocialStoryTemplate | null,
    customScenario: CustomScenarioInput | null,
    childName: string,
    previousScenes: SocialStoryScene[]
): Promise<SocialStoryScene> => {

    const { textEndpoint } = AZURE_CONFIG;

    // Build system prompt for social stories
    const systemPrompt = `
You are a social story generator for children. Social stories help children 
prepare for new experiences by explaining what will happen in a clear, reassuring way.

${template ? `SCENARIO: ${template.title}` : `CUSTOM SCENARIO: ${customScenario?.title}`}
${template ? `DESCRIPTION: ${template.description}` : `DESCRIPTION: ${customScenario?.description}`}
CHILD'S NAME: ${childName}
CURRENT SCENE: ${sceneNumber} of ${totalScenes}

${template ? `KEY PEOPLE: ${template.keyPeople.join(', ')}` : customScenario?.keyPeople ? `KEY PEOPLE: ${customScenario.keyPeople.join(', ')}` : ''}
${template ? `COMMON CONCERNS: ${template.commonFears.join(', ')}` : customScenario?.commonConcerns ? `COMMON CONCERNS: ${customScenario.commonConcerns.join(', ')}` : ''}

CRITICAL RULES:
1. Output MUST be valid JSON only, no markdown fencing.
2. Use second-person perspective ("You will..." or "You might see...").
3. IMPORTANT: The child (${childName}) IS the protagonist "You". NEVER say "You and ${childName}". Always refer to the child as "You".
4. Use present or future tense (not past tense)
5. Keep language simple, concrete, and reassuring
6. Each scene should be 2-4 sentences
7. Focus on sensory details (what they'll see, hear, feel)
8. Acknowledge feelings without being scary ("You might feel nervous, and that's okay")
9. Introduce one key person or concept per scene
10. Maintain a calm, positive tone throughout

STRUCTURE:
{
  "scene_number": ${sceneNumber},
  "scene_title": "string (2-5 words)",
  "scene_text": "string (2-4 sentences, child-friendly, refer to the child as 'You', never use their name)",
  "image_description": "string (visual description for image generator, realistic children's book style)",
  "educational_note": "string (optional tip for parents)",
  "person_introduced": {
    "role": "string (e.g., 'dentist')",
    "name": "string",
    "description": "string (physical appearance for image generation)",
    "what_they_do": "string (their role explained simply)"
  }, // Only include if a new person appears in this scene
  "is_final_scene": ${sceneNumber === totalScenes ? 'true' : 'false'}
}

SCENE PROGRESSION GUIDE:
Scene 1: Arrival/Introduction (where you're going, why)
Scene 2-3: Meeting people (who will help you)
Scene 4-5: Main activity (what will happen, step by step)
Scene 6: Addressing concerns (it's okay to feel nervous)
Scene 7+: Positive conclusion (you did it! what happens next)

If scene_number equals ${totalScenes}, set is_final_scene to true and wrap up the story positively.
`;

    // Build user prompt with context
    let userPrompt = '';

    if (previousScenes.length > 0) {
        userPrompt += 'Story so far:\n';
        previousScenes.forEach(scene => {
            userPrompt += `Scene ${scene.scene_number}: ${scene.scene_title} - ${scene.scene_text}\n`;
        });
        userPrompt += '\n';
    }

    userPrompt += `Generate scene ${sceneNumber} of ${totalScenes}.`;

    if (customScenario?.specificDetails) {
        userPrompt += `\n\nAdditional context: ${customScenario.specificDetails}`;
    }

    try {
        const response = await fetch(textEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-5.1-chat",
                input: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Text API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

        // Extract content from response
        let content;

        if (data.output && Array.isArray(data.output)) {
            const messageOutput = data.output.find((item: any) => item.type === 'message');
            if (messageOutput?.content && Array.isArray(messageOutput.content)) {
                const textContent = messageOutput.content.find((item: any) => item.type === 'output_text');
                if (textContent?.text) {
                    content = textContent.text;
                }
            }
        }

        if (!content && data.choices && data.choices[0]?.message?.content) {
            content = data.choices[0].message.content;
        } else if (!content && data.content) {
            content = data.content;
        }

        if (!content) {
            console.error("Unexpected API response structure:", data);
            throw new Error("Unable to extract content from API response. Check console for details.");
        }

        try {
            const parsedScene: SocialStoryScene = JSON.parse(content);
            return parsedScene;
        } catch (e) {
            console.error("Failed to parse JSON from model:", content);
            throw new Error("Model did not return valid JSON.");
        }

    } catch (error) {
        console.error("Social Story Generation Failed:", error);
        throw error;
    }
};

// ============================================================================
// CHARACTER REFERENCE GENERATION (Reused from DreamWeaver)
// ============================================================================

export const generateCharacterReference = async (
    characterDescription: string,
    artStyle: string
): Promise<ImageGenerationResult> => {
    const { imageEndpoint } = AZURE_CONFIG;

    const fullPrompt = `Create a clean character reference sheet in a simple cartoon children's-book style with crisp black outlines and flat colors.
Show the character standing in a neutral pose on a plain white background.
Include: A single full-body front view (large, centered).
The character should follow this description: ${characterDescription}

Requirements:
• Clear, bold outlines
• Simple shapes and proportions
• Flat colors or very light cel shading (Avoid complex lighting that alters colors)
• Ensure colors are distinct and accurate to the description
• No scenery, no props, no background details
• No text of any kind
• Keep layout simple
• Art style: ${artStyle}
• Do not include any artist signatures, watermarks, or text.`;

    return callBackendImageApi(imageEndpoint, 'generation', fullPrompt, null);
};

// ============================================================================
// IMAGE GENERATION (Reused from DreamWeaver)
// ============================================================================

export const generateImage = async (
    description: string,
    artStyle: string,
    referenceImageUrl: string | null
): Promise<ImageGenerationResult> => {
    const { imageEndpoint } = AZURE_CONFIG;

    let fullPrompt = "";
    let mode = 'generation';

    if (referenceImageUrl) {
        mode = 'edit';

        fullPrompt = `STRICT COLOR AND IDENTITY CONSISTENCY REQUIRED.
Use the attached reference image as the absolute source of truth for the characters.
• The reference image contains a lineup of one or more characters on a white background. 
• You MUST use the exact colors from the reference image for the characters.
• Keep facial features, body proportions, and markings identical to the reference.

Do not redesign the characters. Only adjust pose, lighting, and the new environment.

Now create the story scene in the same simple cartoon children's-book style with clean outlines and flat or lightly-shaded colors.

Scene description: ${description}

Requirements:
• Background should match the scene but stay consistent with the art style
• Keep the characters fully recognizable and matching the reference
• No text
• No speech bubbles
• Art style: ${artStyle}
• Do not include any artist signatures, watermarks, or text.`;
    } else {
        fullPrompt = `${description}. Art style: ${artStyle}. Do not include any artist signatures, watermarks, or text.`;
    }

    return callBackendImageApi(imageEndpoint, mode, fullPrompt, referenceImageUrl);
};

// Helper for calling the Backend API
const callBackendImageApi = async (
    endpoint: string,
    mode: string,
    prompt: string,
    referenceImage: string | null
): Promise<ImageGenerationResult> => {

    const payload: any = {
        mode: mode,
        prompt: prompt,
        image: referenceImage
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Image API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log("Raw Image API Response:", data);

        let finalUrl = null;

        if (data.output_url) {
            finalUrl = data.output_url;
        } else if (data.url) {
            finalUrl = data.url;
        } else if (data.data && Array.isArray(data.data)) {
            if (data.data[0]?.url) {
                finalUrl = data.data[0].url;
            } else if (data.data[0]?.b64_json) {
                finalUrl = `data:image/png;base64,${data.data[0].b64_json}`;
            }
        } else if (data.images && data.images.length > 0) {
            const img = data.images[0];
            if (typeof img === 'string') {
                finalUrl = img.startsWith('http') ? img : `data:image/png;base64,${img}`;
            } else if (img.url) {
                finalUrl = img.url;
            }
        }

        if (!finalUrl) {
            throw new Error(`No image URL found in response`);
        }

        return { imageUrl: finalUrl, debugPrompt: prompt };

    } catch (error) {
        console.error("Image Generation Failed:", error);
        return {
            imageUrl: "",
            debugPrompt: `FAILED: ${error instanceof Error ? error.message : String(error)} \n\n ATTEMPTED PROMPT: ${prompt}`
        };
    }
};
