declare const CreateChannelDto_base: any;
export declare class CreateChannelDto extends CreateChannelDto_base {
    name: string;
    description?: string;
    privacy?: 'PUBLIC' | 'PRIVATE';
    projectId?: string;
}
export {};
