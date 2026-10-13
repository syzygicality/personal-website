declare module '*.css'

declare module '*.yaml' {
  const data: Record<string, any>
  export default data
}
