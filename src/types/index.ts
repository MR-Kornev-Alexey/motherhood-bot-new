export type QAItem = {
    id: number;
    uuid: string;
    title: string;
    date: string; // формат: DD-MM-YY
    link: string;
    type: string;
    description: string;
    descriptionFormat?: string; // опционально
};
