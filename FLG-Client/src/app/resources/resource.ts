export interface Resource {
    id: number;
    title: string;
    tags: string;
    tagList: any;
    resource: string;
    updateddate: string;    // TODO: Maybe not needed? 02/18/20
}

export function newResource() : Resource {
    const r:Resource = {
      id: 0, 
      title: '',
      tags: '',
      tagList: null,
      resource: '',
      updateddate: null
    };
    return r;
} 