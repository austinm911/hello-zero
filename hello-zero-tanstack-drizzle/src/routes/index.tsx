import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Schema } from '@/db/schema/zero'
import { faker } from '@faker-js/faker'
import { useQuery, useZero } from '@rocicorp/zero/react'
import { createFileRoute } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { ClockIcon, Loader2Icon, PlusIcon, Trash2Icon } from 'lucide-react'

const currentUserId = '1'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})
console.log(faker.string.uuid())
function RouteComponent() {
	const z = useZero<Schema>()
	const all = z.query.todo.orderBy('created_at', 'desc').related('createdBy')
	const [allTodos] = useQuery(all)
	const currentUser = allTodos[0]?.createdBy?.id

	const handleAddTodo = (user: string) => {
		z.mutate.todo.insert({
			id: crypto.randomUUID(),
			description: faker.lorem.sentence(),
			completed: false,
			created_by: user,
		})
	}

	const handleDeleteTodo = (id: string) => {
		z.mutate.todo.delete({ id })
	}

	const handleToggleTodo = (id: string, completed: boolean) => {
		z.mutate.todo.update({ id, completed })
	}

	return (
		<div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Todo List</h1>
				{/* User */}
				<div className="text-sm text-gray-500 dark:text-gray-400">{currentUser}</div>
				{/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
				<Button onClick={() => handleAddTodo(currentUser!)} className="gap-2">
					<PlusIcon className="h-4 w-4" />
					Add Todo
				</Button>
			</div>

			{!allTodos ? (
				<div className="flex justify-center py-8">
					<Loader2Icon className="h-8 w-8 animate-spin text-gray-500" />
				</div>
			) : (
				<div className="space-y-4">
					{allTodos.map((todo) => (
						<div
							key={todo.id}
							className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<Checkbox
								checked={todo.completed ?? false}
								onCheckedChange={(checked) => handleToggleTodo(todo.id, !!checked)}
								className="h-5 w-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-primary"
							/>
							<div className="flex-1 space-y-1">
								<p
									className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
								>
									{todo.description}
								</p>
								<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
									<ClockIcon className="h-3 w-3" />
									<span>
										{formatDistanceToNow(new Date(todo.created_at ?? 0), { addSuffix: true })}
									</span>
								</div>
								{
									<span className="text-xs text-gray-500 dark:text-gray-400">
										Created By: {todo.createdBy?.name}
									</span>
								}
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleDeleteTodo(todo.id)}
								className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
							>
								<Trash2Icon className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
