import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { TbChartBar, TbLogout, TbSettings, TbUsers } from 'react-icons/tb'
import { useLogout, useSession } from '@/frontend/hooks/useAuth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    try {
      const data = await context.queryClient.ensureQueryData({
        queryKey: ['auth', 'session'],
        queryFn: () => fetch('/api/auth/session', { credentials: 'include' }).then((r) => r.json()),
      })
      if (!data?.user) throw redirect({ to: '/login' })
      if (data.user.role !== 'SUPER_ADMIN') throw redirect({ to: '/profile' })
    } catch (e) {
      if (e instanceof Error) throw redirect({ to: '/login' })
      throw e
    }
  },
  component: DashboardPage,
})

const stats = [
  { title: 'Users', value: '1,234', icon: TbUsers, color: 'blue' },
  { title: 'Revenue', value: '$12.4k', icon: TbChartBar, color: 'green' },
  { title: 'Settings', value: '3 active', icon: TbSettings, color: 'violet' },
]

function DashboardPage() {
  const { data } = useSession()
  const logout = useLogout()
  const user = data?.user

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Dashboard</Title>
          <Button
            variant="light"
            color="red"
            leftSection={<TbLogout size={16} />}
            onClick={() => logout.mutate()}
            loading={logout.isPending}
          >
            Logout
          </Button>
        </Group>

        <Paper withBorder p="lg" radius="md">
          <Group>
            <Avatar color="blue" radius="xl" size="lg">
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Group gap="xs">
                <Text fw={500}>{user?.name}</Text>
                <Badge color="red" variant="light" size="sm">SUPER ADMIN</Badge>
              </Group>
              <Text c="dimmed" size="sm">{user?.email}</Text>
            </div>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          {stats.map((stat) => (
            <Card key={stat.title} withBorder padding="lg" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>{stat.title}</Text>
                <ThemeIcon variant="light" color={stat.color} size="sm">
                  <stat.icon size={14} />
                </ThemeIcon>
              </Group>
              <Text fw={700} size="xl">{stat.value}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
