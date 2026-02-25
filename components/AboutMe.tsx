import { PostContent } from "@/components/PostContent";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import type { AboutMeContent } from "@/lib/profileClient";

interface AboutMeProps {
  /** GitHub username from config (e.g. GIST_ACCOUNT). Used to show profile image in readme mode. */
  username: string;
  content: NonNullable<AboutMeContent>;
}

/**
 * Renders the About Me section.
 * Displays either profile README markdown or account profile fields.
 * Profile image is visible in both modes, derived from username (no hardcoded URLs).
 */
export function AboutMe({ username, content }: AboutMeProps) {
  if (content.type === "readme") {
    return (
      <section className="about-me" aria-labelledby="about-me-heading">
        <div className="about-me__banner">
          <AuthorAvatar
            account={username}
            size={80}
            className="about-me__avatar"
          />
          <h2 id="about-me-heading" className="about-me__heading">
            About Me
          </h2>
        </div>
        <PostContent content={content.markdown} />
      </section>
    );
  }

  const { fields } = content;
  return (
    <section className="about-me" aria-labelledby="about-me-heading">
      <h2 id="about-me-heading" className="about-me__heading">
        About Me
      </h2>
      <div className="about-me__profile">
        <AuthorAvatar
          account={fields.username}
          size={80}
          className="about-me__avatar"
        />
        <div className="about-me__fields">
          {(fields.name || fields.username) && (
            <p className="about-me__name">{fields.name || fields.username}</p>
          )}
          {fields.bio && (
            <p className="about-me__bio">{fields.bio}</p>
          )}
          {fields.location && (
            <p className="about-me__location">📍 {fields.location}</p>
          )}
          {fields.website && (
            <p className="about-me__website">
              <a
                href={
                  fields.website.startsWith("http")
                    ? fields.website
                    : `https://${fields.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {fields.website}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
