import { transform } from "./transform";

export default {
	async fetch(request: Request): Promise<Response> {
		console.log(request.method, request.cf, [...request.headers.entries()]);
		const url = new URL(request.url);
		console.log(url);

		if (url.pathname === "/") {
			return Response.redirect(
				"https://github.com/JacobLinCool/ChatGPT-Action-Everywhere/#readme",
				301,
			);
		}

		return transform(url, request);
	},
};
