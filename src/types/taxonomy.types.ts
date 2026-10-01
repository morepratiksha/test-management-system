export interface Subject { id: string; name: string; }
export interface Topic { id: string; name: string; subject_id: string; }
export interface SubTopic { id: string; name: string; topic_id: string; }

export interface SubjectResponse { success: boolean; data: Subject[]; message?: string; }
export interface TopicsResponse { success: boolean; data: Topic[]; message?: string; }
export interface SubTopicsResponse { success: boolean; data: SubTopic[]; message?: string; }

export interface MultiSubTopicsPayload { topicIds: string[]; }
export interface MultiSubTopicsResponse { success: boolean; data: SubTopic[]; message?: string; }
