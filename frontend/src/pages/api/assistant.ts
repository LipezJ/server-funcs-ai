import { OpenAI } from 'openai';
import type { APIRoute } from 'astro';
import { AssistantResponse } from 'ai';

interface InputData {
	threadId: string | null;
	message: string;
}

export const POST: APIRoute = async ({ request }) => {
	const token = request.headers.get('Authorization');
	if (!token) {
		return new Response('Unauthorized', { status: 401 });
	}

	const input: InputData = await request.json();
	const assistantId =
		request.headers.get('Assistant-Id') ?? import.meta.env.ASSISTANT_ID;

	const openai = new OpenAI({
		apiKey: token,
	});

	const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

	const createdMessage = await openai.beta.threads.messages.create(threadId, {
		role: 'user',
		content: input.message,
	});

	return AssistantResponse(
		{ threadId, messageId: createdMessage.id },
		async ({ forwardStream, sendDataMessage }) => {
			const runStream = openai.beta.threads.runs.stream(threadId, {
				assistant_id:
					assistantId ??
					(() => {
						throw new Error('ASSISTANT_ID is not set');
					})(),
			});

			let runResult = await forwardStream(runStream);

			while (
				runResult?.status === 'requires_action' &&
				runResult.required_action?.type === 'submit_tool_outputs'
			) {
				const tool_outputs =
					runResult.required_action.submit_tool_outputs.tool_calls.map(
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						(toolCall: any) => {
							const parameters = JSON.parse(toolCall.function.arguments);

							switch (toolCall.function.name) {
								// configure your tool calls here

								default:
									throw new Error(
										`Unknown tool call function: ${toolCall.function.name}`,
									);
							}
						},
					);

				runResult = await forwardStream(
					openai.beta.threads.runs.submitToolOutputsStream(
						threadId,
						runResult.id,
						{ tool_outputs },
					),
				);
			}
		},
	);
};
