-- RLS Policies for brain_gym_exercises (public read access)
CREATE POLICY "Anyone can view brain gym exercises" 
ON public.brain_gym_exercises 
FOR SELECT 
USING (true);

-- RLS Policies for brain_gym_sessions
CREATE POLICY "Users can view their own brain gym sessions" 
ON public.brain_gym_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brain gym sessions" 
ON public.brain_gym_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brain gym sessions" 
ON public.brain_gym_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view linked patient brain gym sessions" 
ON public.brain_gym_sessions 
FOR SELECT 
USING (can_caregiver_view_patient(user_id));

-- RLS Policies for support_groups
CREATE POLICY "Anyone can view public support groups" 
ON public.support_groups 
FOR SELECT 
USING (NOT is_private);

CREATE POLICY "Group members can view private groups" 
ON public.support_groups 
FOR SELECT 
USING (is_private AND EXISTS (
  SELECT 1 FROM support_group_members 
  WHERE group_id = support_groups.id AND user_id = auth.uid()
));

CREATE POLICY "Authenticated users can create support groups" 
ON public.support_groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators and moderators can update groups" 
ON public.support_groups 
FOR UPDATE 
USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM support_group_members 
    WHERE group_id = support_groups.id 
    AND user_id = auth.uid() 
    AND role IN ('moderator', 'admin')
  )
);

-- RLS Policies for support_group_members
CREATE POLICY "Users can view group memberships" 
ON public.support_group_members 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM support_groups 
    WHERE id = group_id AND NOT is_private
  ) OR
  EXISTS (
    SELECT 1 FROM support_group_members AS sgm
    WHERE sgm.group_id = support_group_members.group_id 
    AND sgm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join groups" 
ON public.support_group_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership" 
ON public.support_group_members 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
ON public.support_group_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for support_group_posts
CREATE POLICY "Group members can view posts" 
ON public.support_group_posts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM support_group_members 
    WHERE group_id = support_group_posts.group_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Group members can create posts" 
ON public.support_group_posts 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM support_group_members 
    WHERE group_id = support_group_posts.group_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own posts" 
ON public.support_group_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.support_group_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for daily_routines
CREATE POLICY "Users can view their own daily routines" 
ON public.daily_routines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily routines" 
ON public.daily_routines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily routines" 
ON public.daily_routines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily routines" 
ON public.daily_routines 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view linked patient daily routines" 
ON public.daily_routines 
FOR SELECT 
USING (can_caregiver_view_patient(user_id));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_brain_gym_exercises_updated_at
BEFORE UPDATE ON public.brain_gym_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_groups_updated_at
BEFORE UPDATE ON public.support_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_group_posts_updated_at
BEFORE UPDATE ON public.support_group_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_routines_updated_at
BEFORE UPDATE ON public.daily_routines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();