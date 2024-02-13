export declare function expand(template: string, data: Record<string, unknown>, opts?: IOptionsExpand): string;
export interface Template {
	(template: string, opts_?: IOptions): {
		template: string;
		match(uri: string): Record<string, unknown>;
		expand(data: Record<string, unknown>): string;
	};
	new (template: string, opts_?: IOptions): {
		template: string;
		match(uri: string): Record<string, unknown>;
		expand(data: Record<string, unknown>): string;
	};
}
export declare function Template(template: string, opts_?: IOptions): void;
export interface IOptionsExpand {
	encoder?(val: string): string;
}
export interface IOptions extends IOptionsExpand {
	decoder?(str: string): string;
}

export {
	Template as default,
};

export {};
