import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { API_URL } from "../config/api";

type Props = {
  fullName: string;
  email?: string;
  photoUrl?: string | null;
  size?: "xs" | "sm" | "md";
};

export default function UserCell({
  fullName,
  email,
  photoUrl,
  size = "sm",
}: Props) {
  const src = photoUrl ? `${API_URL}${photoUrl}` : undefined;

  return (
    <Flex align="center" gap={3}>
      <Avatar size={size} name={fullName} src={src} />
      <Box>
        <Text fontWeight="600" lineHeight="1.1">
          {fullName}
        </Text>
        {email && (
          <Text fontSize="sm" color="gray.500">
            {email}
          </Text>
        )}
      </Box>
    </Flex>
  );
}
