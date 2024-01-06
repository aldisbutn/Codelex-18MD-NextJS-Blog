'use server';
// revalidateTag wasnt working, found this on stackoverflow
import { revalidateTag } from 'next/cache';
export default async function revalidateTagAction(tag: string) {
  revalidateTag(tag);
}
