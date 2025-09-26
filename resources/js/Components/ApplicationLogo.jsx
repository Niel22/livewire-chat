export default function ApplicationLogo({ className = "", ...props }) {
  return (
    <>
      <img
        src="/assets/img/logo-light.png"
        alt="Logo Light"
        className={`block dark:hidden ${className}`}
        {...props}
      />
      <img
        src="/assets/img/logo.png"
        alt="Logo Dark"
        className={`hidden dark:block ${className}`}
        {...props}
      />
    </>
  );
}
