import { Notify } from 'quasar'

const successNotify = (message: string, { onDismiss }: {onDismiss?: () => void}) => {
  notify(message, 'primary', 'fa-solid fa-check', { onDismiss })
}

const errorNotify = (message: string, { onDismiss }: {onDismiss?: () => void}) => {
  notify(message, 'negative', 'report_problem', { onDismiss })
}

const notify = (message: string, color: string, icon:string, { onDismiss }: {onDismiss?: () => void}) => {
  Notify.create({
    message,
    color,
    icon,
    onDismiss
  })
}

export { successNotify, errorNotify }
