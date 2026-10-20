import { useRef, type MouseEvent, type ReactNode } from "react";
import { useNavigation } from "../navigation";
import { canonicalHref, getRoute, LEGACY_PAGES, NOT_FOUND } from "../route-urls";
import "../css/link.css";


function Link(props: { link: string, a_style?: boolean, active?: boolean, children: ReactNode })
{
	const { a_style = false, active = false, link, children } = props;
	const navigation = useNavigation();
	const pressedHref = useRef<string | null>(null);

	const destination = () =>
	{
		const url = new URL(link, window.location.href);
		return new URL(canonicalHref(url.href, LEGACY_PAGES), url.origin);
	};

	const prepare = () =>
	{
		if (navigation && !link.startsWith("#"))
		{
			navigation.prepare(destination());
		}
	};

	const navigate = (event: MouseEvent<HTMLAnchorElement>) =>
	{
		const previousPress = pressedHref.current;
		pressedHref.current = null;

		if (!navigation || event.defaultPrevented || event.button !== 0
			|| event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
			|| link.startsWith("#") || event.currentTarget.hasAttribute("download")
			|| (event.currentTarget.target && event.currentTarget.target !== "_self"))
		{
			return;
		}

		const url = destination();
		if (url.origin !== window.location.origin || getRoute(url.pathname) === NOT_FOUND)
		{
			return;
		}

		if (event.type === "mousedown")
		{
			pressedHref.current = url.href;
			navigation.navigate(url);
			return;
		}

		event.preventDefault();

		// The press already navigated; keyboard clicks still need to navigate.
		if (event.detail === 0 || previousPress !== url.href)
		{
			navigation.navigate(url);
		}
	};

	return (
		<a
			className={`link ${a_style ? "a-style-link" : "standard-style-link"}${active ? " active-link" : ""}`}
			href={link}
			onMouseDown={navigate}
			onClick={navigate}
			onPointerEnter={prepare}
			onFocus={prepare}
			onTouchStart={prepare}
		>
			{children}
		</a>
	);
}

export default Link;
