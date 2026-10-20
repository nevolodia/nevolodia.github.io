// Follow static imports only, so loading one page does not load other pages.
export function routeAssets(manifest, modules)
{
	const visited = new Set();
	const styles = new Set();
	const scripts = new Set();

	function visit(key)
	{
		if (visited.has(key))
		{
			return;
		}

		const chunk = manifest[key];
		if (!chunk)
		{
			throw new Error(`Missing client manifest module: ${key}`);
		}

		visited.add(key);

		for (const dependency of chunk.imports || [])
		{
			visit(dependency);
		}

		for (const css of chunk.css || [])
		{
			styles.add(css);
		}

		if (chunk.file.endsWith(".js"))
		{
			scripts.add(chunk.file);
		}
	}

	for (const module of modules)
	{
		visit(module);
	}

	return { styles: [...styles], scripts: [...scripts] };
}
