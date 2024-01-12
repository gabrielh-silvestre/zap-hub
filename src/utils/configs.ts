export const AGENT_ID = import.meta.env.AGENT_ID as string;
if (!AGENT_ID) throw new Error('AGENT_ID not found');
